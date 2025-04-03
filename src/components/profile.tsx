"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Camera, Check, ChevronLeft, Loader2Icon, Mail, Phone, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Header from "./header"
import { useUser } from "@clerk/clerk-react"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import { FormDataValues } from "@/types/types"
import { PhoneNumberResource } from '@clerk/types'
import { E164Number, getCountries, getCountryCallingCode, parsePhoneNumberWithError, PhoneNumber } from 'libphonenumber-js'
import * as countriesLib from 'i18n-iso-countries'
import enLocale from 'i18n-iso-countries/langs/en.json'

import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList, CommandGroup } from "./ui/command"
import { cn } from "@/lib/utils"
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "./ui/input-otp"
import { REGEXP_ONLY_DIGITS } from "input-otp"
import { useSearchParams } from "react-router-dom"

countriesLib.registerLocale(enLocale);
const countries = getCountries().map(code => ({
    code,
    name: countriesLib.getName(code, "en") ?? code,
    dialCode: `+${getCountryCallingCode(code)}`,
}));

function getFlagEmoji(countryCode: string) {
    return countryCode
        .toUpperCase()
        .replace(/./g, char =>
            String.fromCodePoint(127397 + char.charCodeAt(0))
        );
}

export default function ProfilePage() {
    const { user, isLoaded } = useUser()
    const [searchParams] = useSearchParams()
    const [phoneDialogOpen, setPhoneDialogOpen] = useState(false);
    const [phoneFromUrl, setPhoneFromUrl] = useState<PhoneNumber>()

    // useEffect(() => {
    //     const phoneFromUrl = searchParams.get("addPhone");
    //     if (phoneFromUrl) {
    //         const phoneNumber = parsePhoneNumberWithError(`+${phoneFromUrl}`);
    //         const phoneValue = countries.find(country => country.code === phoneNumber.country)?.name
    //         if (phoneValue) setPhoneValue(phoneValue);
    //         console.log(phoneFromUrl)
    //         setPhoneFromUrl(phoneNumber);
    //         setPhoneDialogOpen(true);
    //     }
    // }, [searchParams]);

    useEffect(() => {
        const phoneFromUrl = searchParams.get("addPhone");
        if (!phoneFromUrl) return;

        const original = parsePhoneNumberWithError(`+${phoneFromUrl}`);
        const countryInfo = countries.find(c => c.code === original.country);

        if (countryInfo) setPhoneValue(countryInfo.name);

        const national = original.nationalNumber;

        const correctedNumber =
            original.country === "BR" && national.length === 10 && !national.startsWith("9")
                ? `+${original.countryCallingCode}${national.slice(0, 2)}9${national.slice(2)}`
                : original.number;

        const parsed = parsePhoneNumberWithError(correctedNumber as unknown as E164Number);
        setPhoneFromUrl(parsed);
        setPhoneDialogOpen(true);
    }, [searchParams]);


    const [isFileInvalid, setIsFileInvalid] = useState<boolean>(false)
    const [hasImageChanged, setHasImageChanged] = useState<boolean>(false)
    const [newProfilePicture, setNewProfilePicture] = useState<string>()
    const [open, setOpen] = useState<boolean>(false)
    const [phoneValue, setPhoneValue] = useState<string>("Brazil")

    const [phoneObj, setPhoneObj] = useState<PhoneNumberResource>()
    const [code, setCode] = useState<string>()

    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [isVerifyingPhone, setIsVerifyingPhone] = useState<boolean>(false)
    // const [success, setSuccess] = useState<boolean>(false)
    // const [failed, setFailed] = useState<boolean>(false)

    const fileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = error => reject(error);
        });
    };

    const handleFileInput = async (file: File) => {
        const maxSize = 2 * 1024 * 1024;

        if (file.size > maxSize) {
            alert("O arquivo deve ter no máximo 2MB.");
            setIsFileInvalid(true)
            return;
        }

        const string = await fileToBase64(file)
        setNewProfilePicture(string)
        setHasImageChanged(true)
        setIsFileInvalid(false)
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);

        const firstName = formData.get("name") as string;
        const lastName = formData.get("surname") as string;
        const username = formData.get("username") as string;
        const phone = formData.get("phone") as string;
        const phoneNumber = `${(countries.find(country => country.name === phoneValue)?.dialCode)?.replace("+", "")}${phone}`
        const file = formData.get("avatar") as File || null;
        // const imageUrl = file ? await fileToBase64(file) : undefined

        if ((firstName !== null || lastName !== null || username !== null) && (user?.firstName !== firstName || user.lastName !== lastName || user.username !== username)) {
            await updateProfile({ firstName, lastName, username })
        }

        if (user?.primaryPhoneNumber?.phoneNumber !== phoneNumber) {
            setIsLoading(true)
            const createPhone = await user?.createPhoneNumber({ phoneNumber })
            user?.primaryPhoneNumber?.create()
            createPhone?.prepareVerification()
            setPhoneObj(createPhone)
            setIsVerifyingPhone(true)
            setIsLoading(false)
            setPhoneDialogOpen(false)
            await user?.reload()
        }

        if (file && !isFileInvalid && hasImageChanged) {
            setHasImageChanged(false)
            await user?.setProfileImage({ file })
        }
    };

    const updateProfile = async (data: FormDataValues) => {
        if (!user || !isLoaded) return
        const { firstName, lastName, username } = data

        await user?.update({
            firstName: firstName,
            lastName: lastName,
            username: username,
        })
    }

    const handleCodeVerification = async () => {
        setIsLoading(true)
        if (!code) return
        const phoneVerifyAttempt = await phoneObj?.attemptVerification({ code })

        if (phoneVerifyAttempt?.verification.status === 'verified') {
            await user?.update({ primaryPhoneNumberId: phoneObj?.id })
            await user?.reload()
            // setSuccess(true)
        } else {
            // setFailed(true)
            console.error(JSON.stringify(phoneVerifyAttempt, null, 2))
        }

        setIsVerifyingPhone(false)
        setIsLoading(false)
    }

    // console.log(user?.primaryPhoneNumber?.phoneNumber)

    return (
        <main className="w-full px-[clamp(1rem,5vw,6rem)] flex flex-col">
            <Header />

            <div className="w-full flex flex-col justify-center py-6 space-y-6">
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" asChild>
                        <a href="/">
                            <ChevronLeft className="h-4 w-4" />
                            <span className="sr-only">Back</span>
                        </a>
                    </Button>
                    <h1 className="text-2xl font-bold">Profile</h1>
                </div>

                <div className="grid gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Personal Information</CardTitle>
                            <CardDescription>Manage your personal information and how they are displayed.</CardDescription>
                        </CardHeader>

                        <CardContent className="space-y-6">
                            <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
                                <div className="relative">
                                    <Avatar className="h-24 w-24">
                                        <AvatarImage src={user?.imageUrl} alt={user?.firstName || ''} />
                                        <AvatarFallback className="text-2xl">
                                            {user?.firstName?.charAt(0)}
                                            {user?.lastName?.charAt(0)}
                                        </AvatarFallback>
                                    </Avatar>
                                </div>

                                <div className="space-y-1 text-center sm:text-left">
                                    <h3 className="text-xl font-semibold">
                                        {user?.firstName} {user?.lastName}
                                    </h3>
                                    <p className="text-sm text-muted-foreground">@{user?.username}</p>
                                </div>
                            </div>

                            <Separator />

                            <div className="grid gap-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Name</Label>
                                        <div className="flex items-center gap-2 h-10 px-3 rounded-md border border-input bg-background">
                                            <User className="h-4 w-4 text-muted-foreground" />
                                            <span>{user?.firstName}</span>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="surname">Surname</Label>
                                        <div className="flex items-center gap-2 h-10 px-3 rounded-md border border-input bg-background">
                                            <User className="h-4 w-4 text-muted-foreground" />
                                            <span>{user?.lastName}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="username">Username</Label>
                                        <div className="flex items-center gap-2 h-10 px-3 rounded-md border border-input bg-background">
                                            <span className="text-muted-foreground">@</span>
                                            <span>{user?.username}</span>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="phone">Phone</Label>
                                        <div className="flex items-center gap-2 h-10 px-3 rounded-md border border-input bg-background">
                                            <Phone className="h-4 w-4 text-muted-foreground" />
                                            <span>{user?.primaryPhoneNumber?.phoneNumber || "Uninformed"}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <div className="flex items-center gap-2 h-10 px-3 rounded-md border border-input bg-muted">
                                        <Mail className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-muted-foreground">{user?.primaryEmailAddress?.emailAddress}</span>
                                    </div>
                                    <p className="text-xs text-muted-foreground">The email cannot be changed.</p>
                                </div>
                            </div>
                        </CardContent>

                        <CardFooter className="flex justify-end">
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button> Edit profile</Button>
                                </DialogTrigger>

                                <DialogContent className="max-h-[calc(100%-2rem)] overflow-y-scroll scrollbar-floating">
                                    <DialogHeader className="">
                                        <DialogTitle>User Profile</DialogTitle>
                                        <DialogDescription>Update your profile information. Click save when you're done.</DialogDescription>
                                    </DialogHeader>

                                    <form onSubmit={handleSubmit}>
                                        <div className="grid gap-6 py-6">
                                            <div className="flex flex-col items-center gap-4">
                                                <div className="relative">
                                                    <Avatar className="h-24 w-24">
                                                        <AvatarImage src={newProfilePicture || user?.imageUrl} alt={`${user?.firstName} profile picture`} />
                                                        <AvatarFallback className="text-2xl">
                                                            {user?.firstName?.slice(0, 1)}
                                                            {user?.lastName?.slice(0, 1)}
                                                        </AvatarFallback>
                                                    </Avatar>

                                                    <Label
                                                        htmlFor="avatar-upload"
                                                        className="absolute bottom-0 right-0 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm hover:bg-primary/90"
                                                    >
                                                        <Camera className="h-4 w-4" />
                                                        <span className="sr-only">Change Profile Picture</span>
                                                    </Label>

                                                    <Input
                                                        id="avatar-upload"
                                                        name="avatar"
                                                        type="file"
                                                        accept="image/*"
                                                        className="hidden"
                                                        onChange={(e) => handleFileInput(e.currentTarget.files![0])}
                                                    />
                                                </div>

                                                <div className="text-center">
                                                    <p className="text-sm text-muted-foreground">Click on the camera to change your profile picture</p>
                                                </div>
                                            </div>

                                            <Separator />

                                            <div className="grid gap-4">
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="grid gap-2">
                                                        <Label htmlFor="name">Name</Label>
                                                        <Input
                                                            id="name"
                                                            name="name"
                                                            defaultValue={user?.firstName || ""}
                                                            // onChange={handleInputChange}
                                                            placeholder="Your name"
                                                        />
                                                    </div>

                                                    <div className="grid gap-2">
                                                        <Label htmlFor="surname">Surname</Label>
                                                        <Input
                                                            id="surname"
                                                            name="surname"
                                                            defaultValue={user?.lastName || ""}
                                                            // onChange={handleInputChange}
                                                            placeholder="Your surname"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-2  gap-4">
                                                    <div className="grid gap-2">
                                                        <Label htmlFor="username">Username</Label>
                                                        <Input
                                                            id="username"
                                                            name="username"
                                                            defaultValue={user?.username || ""}
                                                            // onChange={handleInputChange}
                                                            placeholder="Your username"
                                                        />
                                                    </div>

                                                    <div className="grid gap-2">
                                                        <Label htmlFor="username">Phone</Label>

                                                        <div className="flex gap-1">
                                                            <Popover open={open} onOpenChange={setOpen}>
                                                                <PopoverTrigger>
                                                                    <Button
                                                                        type="button"
                                                                        variant="outline"
                                                                        role="combobox"
                                                                        aria-expanded={open}
                                                                        className="w-fit p-0 px-2"
                                                                    >
                                                                        {phoneValue
                                                                            ? countries.find((country) => country.name === phoneValue)?.dialCode
                                                                            : "+55"}
                                                                    </Button>
                                                                </PopoverTrigger>

                                                                <PopoverContent>
                                                                    <Command defaultValue={phoneValue}>
                                                                        <CommandInput />

                                                                        <CommandList className="scroll-py-0">
                                                                            <CommandEmpty>Country not found</CommandEmpty>

                                                                            <CommandGroup>
                                                                                {countries
                                                                                    .sort((a, b) => {
                                                                                        const codeA = parseInt(a.dialCode.replace("+", ""));
                                                                                        const codeB = parseInt(b.dialCode.replace("+", ""));
                                                                                        return codeA - codeB;
                                                                                    })
                                                                                    .map((country, index) => (
                                                                                        <CommandItem key={index} className="flex gap-2"
                                                                                            value={country.name}
                                                                                            onSelect={(currentValue) => {
                                                                                                setPhoneValue(currentValue === phoneValue ? "" : currentValue)
                                                                                                setOpen(false)
                                                                                            }}
                                                                                        >
                                                                                            <span>{getFlagEmoji(country.code)}</span>
                                                                                            <span className="text-muted-foreground">{country.dialCode}</span>
                                                                                            <span>{country.name}</span>
                                                                                            <Check
                                                                                                className={cn(
                                                                                                    "ml-auto",
                                                                                                    phoneValue === country.code ? "opacity-100" : "opacity-0"
                                                                                                )}
                                                                                            />
                                                                                        </CommandItem>
                                                                                    ))}
                                                                            </CommandGroup>
                                                                        </CommandList>
                                                                    </Command>
                                                                </PopoverContent>
                                                            </Popover>

                                                            <Input
                                                                id="phone"
                                                                name="phone"
                                                                defaultValue={user?.primaryPhoneNumber?.phoneNumber || ""}
                                                                // onChange={handleInputChange}
                                                                placeholder="Your Phone Number"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="grid gap-2">
                                                    <Label htmlFor="email">Email</Label>
                                                    <Input id="email" value={user?.primaryEmailAddress?.emailAddress} disabled className="bg-muted/50 text-muted-foreground" />
                                                    <p className="text-xs text-muted-foreground">Email can't be changed.</p>
                                                </div>
                                            </div>
                                        </div>

                                        <DialogFooter>
                                            <DialogClose asChild>
                                                <Button type="button" variant="outline" className="cursor-pointer">
                                                    Cancel
                                                </Button>
                                            </DialogClose>

                                            <Button type="submit" disabled={isLoading}>
                                                {isLoading ? (
                                                    <Loader2Icon className="animate-spin" />
                                                ) : (
                                                    <>Save</>
                                                )}
                                            </Button>
                                        </DialogFooter>
                                    </form>
                                </DialogContent>
                            </Dialog>
                        </CardFooter>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Notification Preferences</CardTitle>
                            <CardDescription>Manage how you get notifications about your tasks.</CardDescription>
                        </CardHeader>

                        <CardContent>
                            <p className="text-sm text-muted-foreground">
                                Notification settings will be implemented soon.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <Dialog open={phoneDialogOpen} onOpenChange={setPhoneDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add Your Phone Number</DialogTitle>
                        <DialogDescription>
                            Confirm or edit the phone number you'd like to add to your profile.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                        <div className="flex gap-1 w-full">
                            <Popover open={open} onOpenChange={setOpen}>
                                <PopoverTrigger>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        role="combobox"
                                        aria-expanded={open}
                                        className="w-fit p-0 px-2"
                                    >
                                        {phoneValue
                                            ? countries.find((country) => country.name === phoneValue)?.dialCode
                                            : "+55"}
                                    </Button>
                                </PopoverTrigger>

                                <PopoverContent>
                                    <Command defaultValue={countries.find((country) => country.code === phoneFromUrl?.country)?.name}>
                                        <CommandInput />

                                        <CommandList className="scroll-py-0">
                                            <CommandEmpty>Country not found</CommandEmpty>

                                            <CommandGroup>
                                                {countries
                                                    .sort((a, b) => {
                                                        const codeA = parseInt(a.dialCode.replace("+", ""));
                                                        const codeB = parseInt(b.dialCode.replace("+", ""));
                                                        return codeA - codeB;
                                                    })
                                                    .map((country, index) => (
                                                        <CommandItem key={index} className="flex gap-2"
                                                            value={country.name}
                                                            onSelect={(currentValue) => {
                                                                setPhoneValue(currentValue === phoneValue ? "" : currentValue)
                                                                setOpen(false)
                                                            }}
                                                        >
                                                            <span>{getFlagEmoji(country.code)}</span>
                                                            <span className="text-muted-foreground">{country.dialCode}</span>
                                                            <span>{country.name}</span>
                                                            <Check
                                                                className={cn(
                                                                    "ml-auto",
                                                                    phoneValue === country.code ? "opacity-100" : "opacity-0"
                                                                )}
                                                            />
                                                        </CommandItem>
                                                    ))}
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>

                            <Input
                                id="phone"
                                name="phone"
                                type="tel"
                                defaultValue={phoneFromUrl?.nationalNumber || ""}
                                // onChange={handleInputChange}
                                placeholder="Your Phone Number"
                            />
                        </div>

                        <DialogFooter>
                            <DialogClose>
                                <Button variant={"ghost"} type="button">
                                    Cancel
                                </Button>
                            </DialogClose>

                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? (
                                    <Loader2Icon className="animate-spin" />
                                ) : (
                                    <>Add Phone</>
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <Dialog open={isVerifyingPhone} onOpenChange={setIsVerifyingPhone}>
                <DialogContent className="flex flex-col gap-5 items-center justify-center z-50">
                    <DialogHeader>
                        <DialogTitle>Verify Your Phone Number</DialogTitle>
                        <DialogDescription>Enter the 6-digit code we sent to your phone to complete the verification.</DialogDescription>
                    </DialogHeader>

                    <InputOTP
                        maxLength={6}
                        onChange={setCode}
                        pattern={REGEXP_ONLY_DIGITS}
                    >
                        <InputOTPGroup>
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                        </InputOTPGroup>
                        <InputOTPSeparator />
                        <InputOTPGroup>
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                            <InputOTPSlot index={5} />
                        </InputOTPGroup>
                    </InputOTP>

                    <DialogFooter className="self-end">
                        <DialogClose>
                            <Button variant={'outline'} onClick={() => setIsVerifyingPhone(false)}>Close</Button>
                        </DialogClose>

                        <Button onClick={handleCodeVerification} disabled={isLoading}>
                            {isLoading ? (
                                <Loader2Icon className="animate-spin" />
                            ) : (
                                <>Verify</>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </main>
    )
}