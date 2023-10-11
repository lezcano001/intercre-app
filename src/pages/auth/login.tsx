import { Button, Flex, useToast } from "@chakra-ui/react";
import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/router";
import { type FormEvent, useState } from "react";
import { StandardInput } from "~/components/ui/StandardInput";

import NextLink from 'next/link'

export default function LoginPage() {
    const { status } = useSession()

    const [userCIInput, setUserCIInput] = useState("")
    const [userPasswordInput, setUserPasswordInput] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const toast = useToast()

    const router = useRouter()

    async function handleLoginForm(e: FormEvent<HTMLDivElement>) {
        e.preventDefault()
        
        setIsLoading(true)

        const res = await signIn("credentials", {
            ci: userCIInput,
            password: userPasswordInput,
            redirect: false
        })

        if (res?.error === "CredentialsSignin") {
            toast({
                title: "Credenciales incorrectas",
                description: "Documento de identidad o Contraseña incorrectos",
                isClosable: true,
                colorScheme: "red",
                position: "top"
            })
        }

        setIsLoading(false)

        if (res?.ok) {
            await router.push("/")
        }
    }

    if (status === "unauthenticated") {
        return (
            <Flex
                className="
                    w-full
                    h-screen
                    bg-white
                    px-8
                    sm:p-0
                    items-center
                    justify-center
                    flex-col
                    gap-14"
            >
                <Image
                    alt="Logotype"
                    src="/logotype.png"
                    width={360}
                    height={210}
                />
                <Flex
                    as="form"
                    className="
                        gap-9
                        bg-white
                        w-full
                        max-w-md
                        flex-col
                        sm:p-12
                        rounded-md"
                    onSubmit={(e) => {
                        void handleLoginForm(e)
                    }}
                >
                    <StandardInput
                        label="Número de Documento:"
                        value={userCIInput}
                        onChange={e => setUserCIInput(e.target.value)}
                    />
                    <StandardInput
                        label="Contraseña:"
                        value={userPasswordInput}
                        onChange={e => setUserPasswordInput(e.target.value)}
                        type="password"
                    />
                    <Flex
                        className="
                            flex-col
                            gap-4"
                    >
                        <Button
                            colorScheme="orange"
                            type="submit"
                            isLoading={isLoading}
                            loadingText="Iniciando sesión"
                        >
                            Iniciar Sesión
                        </Button>
                        <Button
                            as={NextLink}
                            href="/consultas"
                        >
                            Solo Consultas
                        </Button>
                    </Flex>
                </Flex>
            </Flex>
        )
    }

    if (status === "authenticated") {
        // eslint-disable-next-line
        router.push("/")
    }

    return null
}