"use client"
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Label } from "@/components/ui/label";
import { FaCheckCircle } from "react-icons/fa";
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
// import { Icons } from "@/components/icons";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { format } from 'date-fns'; 

const components: { title: string; href: string; description: string }[] = [
    {
        title: "Alert Dialog",
        href: "/docs/primitives/alert-dialog",
        description:
            "A modal dialog that interrupts the user with important content and expects a response.",
    },
    {
        title: "Hover Card",
        href: "/docs/primitives/hover-card",
        description:
            "For sighted users to preview content available behind a link.",
    },
    {
        title: "Progress",
        href: "/docs/primitives/progress",
        description:
            "Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.",
    },
    {
        title: "Scroll-area",
        href: "/docs/primitives/scroll-area",
        description: "Visually or semantically separates content.",
    },
    {
        title: "Tabs",
        href: "/docs/primitives/tabs",
        description:
            "A set of layered sections of content—known as tab panels—that are displayed one at a time.",
    },
    {
        title: "Tooltip",
        href: "/docs/primitives/tooltip",
        description:
            "A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.",
    },
]

interface CertificateData {
    participantName: string;
    id: number;
    certificateCode: string;
    expirationDate: string | null;
    revoked: boolean;
    revocationDate: string;
    revocationReason: string;
    eventId: number;
    filePath: string;
    event: {
        id: number;
        eventName: string;
        organization: {
            id: number;
            organizationName: string;
            
        };
        startDateTime: string;
        endDateTime: string;
        venue: string;
        eventDescription: string;
    };
    createdAt: string;
    
}

export default function ValidatePage() {

    const { id } = useParams();
    const [certificateData, setCertificateData] = useState<CertificateData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCertificateData = async () => {
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/certificate?code=${id}`);
                if (response.status === 200) {
                    const data: CertificateData[] = response.data;
                    console.log(data[0].createdAt)
                    setCertificateData(data[0]);
                } else {
                    console.error("Failed to fetch certificate data");
                }
            } catch (error) {
                console.error("Error fetching certificate data:", error);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchCertificateData();
        }
    }, [id]);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (!certificateData) {
        return <p>Certificate not found</p>;
    }

    return (
        <div className="px-4 sm:px-0 lg:px-48">
            <div className="my-8 flex flex-col md:flex-row justify-between items-center">
                {/* <p className="text-xl md:text-2xl font-bold mb-4 md:mb-0">LOGO HERE</p> */}
                <img src="/storage/GV_final.png" className="size-20 object-contain md:hidden"></img>
                <div className="hidden md:flex items-center space-x-4">
                    <img src="/storage/ICON_COLORED.png" className="size-10 object-contain"></img>
                    <img src="/storage/WORDMARK.png" className="h-6 object-contain"></img>
                </div>

                {/* <Image src= alt={"Logo"} width={50} height={10}/> */}

                {/* NAVIGATION BAR HERE */}
                <div className="text-xl md:text-2xl font-bold hidden md:flex justify-between">
                    {/* Navigation Menu */}
                    <NavigationMenu>
                        <NavigationMenuList>
                            <NavigationMenuItem>
                                <Link href="/" legacyBehavior passHref>
                                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>Home</NavigationMenuLink>
                                </Link>
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                                <Link href="/auth?type=signup" legacyBehavior passHref>
                                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>About</NavigationMenuLink>
                                </Link>
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                                <Link href="/auth?type=login" legacyBehavior passHref>
                                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>Services</NavigationMenuLink>
                                </Link>
                            </NavigationMenuItem>

                        </NavigationMenuList>
                    </NavigationMenu>
                    <div>
                        <Button asChild variant="ghost" className='mr-4'><Link href="auth?type=signup">Sign up</Link></Button>
                        <Button asChild><Link href="auth?type=login">Login</Link></Button>
                    </div>
                </div>
            </div>

            <div className="my-10 flex flex-col md:flex-row justify-between items-start">
                <div className="space-y-4 md:w-1/2">
                    <Label className="text-lg md:text-xl">{certificateData.event.eventName}</Label>
                    <Card className="w-full md:w-[400px]">
                        <CardHeader>
                            <CardTitle className="text-md md:text-lg">Completed by {certificateData.participantName}</CardTitle>
                            <CardDescription className="text-sm">{format(new Date(certificateData.createdAt), 'MMMM d, yyyy')}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-xs md:text-sm">
                                Goverify certifies that they have completed the requirements for the successful completion of <span className="underline">{certificateData.event.eventName}</span>
                            </p>
                        </CardContent>
                    </Card>

                    <div className="flex items-center space-x-4">
                    <FaCheckCircle className="size-10 text-green-500"/>
                    <Label className="text-green-500 text-2xl">Verified</Label>
                    </div>
                </div>

                <img
                    src={`${process.env.NEXT_PUBLIC_API_BASE_URL}${certificateData.filePath}`}
                    alt="Certificate"
                    className="md:m-10 shadow-lg h-[300px] h-auto md:h-[500px] sm:w-full lg:w-auto object-contain mt-4 md:mt-0"
                />
            </div>
        </div>
    );
}

const ListItem = React.forwardRef<
    React.ElementRef<"a">,
    React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
    return (
        <li>
            <NavigationMenuLink asChild>
                <a
                    ref={ref}
                    className={cn(
                        "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                        className
                    )}
                    {...props}
                >
                    <div className="text-sm font-medium leading-none">{title}</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        {children}
                    </p>
                </a>
            </NavigationMenuLink>
        </li>
    )
})
ListItem.displayName = "ListItem"
