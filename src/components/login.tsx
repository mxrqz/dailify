import { ArrowRightIcon, Loader2Icon } from "lucide-react";
import { AppleLogo, GoogleLogo } from "./logos";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import { useState } from "react";
import { useAuth, useSignIn, useUser } from "@clerk/clerk-react";
import { EmailLinkFactor } from '@clerk/types';
import { ClerkAPIError, OAuthStrategy } from '@clerk/types';
import VerifyingLink from "./verifying-link";

export default function Login() {
    const { signOut } = useAuth()
    const { signIn, isLoaded } = useSignIn()
    const { isSignedIn } = useUser()

    const [verifying, setVerifying] = useState(false)
    const [email, setEmail] = useState<string>("")

    const signInWith = (strategy: OAuthStrategy) => {
        if (!signIn) return null

        return signIn
            .authenticateWithRedirect({
                strategy,
                redirectUrl: '/login/sso-callback',
                redirectUrlComplete: '/',
            })
            .then((res) => {
                console.log(res)
            })
            .catch((err: ClerkAPIError) => {
                console.log(err.message)
                console.error(err, null, 2)
            })
    }

    const handleAction = (action: string) => {
        if (action === 'back') {
            setVerifying(false)
            setEmail("")
        }
    }

    // const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    //     e.preventDefault()
    //     if (!signIn) return

    //     setVerified(false)

    //     const formData = new FormData(e.currentTarget);
    //     const emailAddress = formData.get("email") as string

    //     const { startEmailLinkFlow } = signIn.createEmailLinkFlow()

    //     try {
    //         const { supportedFirstFactors } = await signIn.create({
    //             identifier: emailAddress,
    //         })

    //         setVerifying(true)
    //         setEmail(emailAddress)

    //         const isEmailLinkFactor = (factor: SignInFirstFactor): factor is EmailLinkFactor => {
    //             return factor.strategy === 'email_link'
    //         }
    //         const emailLinkFactor = supportedFirstFactors?.find(isEmailLinkFactor)

    //         if (!emailLinkFactor) {
    //             console.log('Email link factor not found')
    //             return
    //         }

    //         const { emailAddressId } = emailLinkFactor

    //         const protocol = window.location.protocol
    //         const host = window.location.host

    //         const signInAttempt = await startEmailLinkFlow({
    //             emailAddressId,
    //             redirectUrl: `${protocol}//${host}/sign-in/verify`,
    //         })

    //         const verification = signInAttempt.firstFactorVerification

    //         if (verification.status === 'expired') {
    //             console.log('The email link has expired.')
    //         }

    //         if (verification.status === 'verified') {
    //             setVerifying(false)
    //             setVerified(true)
    //         }
    //     } catch (err: any) {
    //         console.error(JSON.stringify(err, null, 2))
    //         console.log('An error occurred.')
    //     }
    // }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!signIn || !isLoaded) return;

        setVerifying(true);

        const formData = new FormData(e.currentTarget);
        const emailAddress = formData.get("email") as string;
        setEmail(emailAddress);

        try {
            const { supportedFirstFactors } = await signIn.create({ identifier: emailAddress });

            const emailLinkFactor = supportedFirstFactors?.find(
                (factor): factor is EmailLinkFactor => factor.strategy === "email_link"
            );

            if (!emailLinkFactor) {
                console.log("Email link factor not found");
                return;
            }

            // futuramente mudar para uma url fixa, no caso um dominio fixo
            const url = "https://dailify.mxrqz.com" // window.location.origin
            const redirectUrl = `${url}/sign-in/verify`;
            const signInAttempt = await signIn.createEmailLinkFlow().startEmailLinkFlow({
                emailAddressId: emailLinkFactor.emailAddressId,
                redirectUrl,
            });

            if (signInAttempt.firstFactorVerification.status === "verified") {
                window.location.href = "/"
            } else if (signInAttempt.firstFactorVerification.status === "expired") {
                console.log("The email link has expired.");
            }
        } catch (err: any) {
            console.error("Error:", err);
        } finally {
            setVerifying(false);
        }
    };

    if (!isLoaded) {
        return (
            <div className="w-full h-dvh grid place-items-center bg-background">
                <Loader2Icon className="size-12 text-foreground animate-spin" />
            </div>
        )
    }

    return (
        <div className="w-full h-dvh flex flex-col justify-center items-center py-5 px-[clamp(1rem,5vw,6rem)]">
            {verifying && email ? (
                <VerifyingLink email={email} onAction={handleAction} />
            ) : (
                <Card className="w-full md:max-w-1/2">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold text-center">Welcome to Dailify</CardTitle>
                        <CardDescription className="text-center">Login to continue</CardDescription>
                    </CardHeader>

                    <CardContent className="flex flex-col gap-3">
                        <div className="w-full flex gap-3">
                            <Button variant={"outline"} className="w-full flex-1" onClick={() => signInWith('oauth_apple')}>
                                <AppleLogo className="fill-foreground" />
                                Apple
                            </Button>

                            <Button variant={"outline"} className="w-full flex-1" onClick={() => signInWith('oauth_google')}>
                                <GoogleLogo className="fill-foreground" />
                                Google
                            </Button>
                        </div>

                        <div className="inline-flex items-center gap-3">
                            <Separator className="shrink" />
                            <span>or</span>
                            <Separator className="shrink" />
                        </div>

                        <form className="w-full flex flex-col gap-3" onSubmit={handleSubmit}>
                            <div className="flex flex-col gap-1">
                                <Label htmlFor="email">Email</Label>
                                <Input type="email" id="email" name="email" />
                            </div>

                            <Button
                                variant={"secondary"}
                                className="hover:[&_svg]:translate-x-2 [&_svg]:transition-transform cursor-pointer"
                                type="submit"
                            >
                                Login
                                <ArrowRightIcon />
                            </Button>
                        </form>

                        {isSignedIn && (
                            <Button variant={"destructive"} onClick={() => signOut()}>
                                Logout
                            </Button>
                        )}
                    </CardContent>
                </Card>
            )}

            <div id="clerk-captcha" />
        </div>
    )
}