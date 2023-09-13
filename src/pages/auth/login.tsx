import { Button, Flex, useToast } from "@chakra-ui/react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { type FormEvent, useState } from "react";
import { StandardInput } from "~/components/ui/StandardInput";

export default function LoginPage() {
    const { status } = useSession()

    const [userCIInput, setUserCIInput] = useState("")
    const [userPasswordInput, setUserPasswordInput] = useState("")

    const toast = useToast()

    const router = useRouter()

    async function handleLoginForm(e: FormEvent<HTMLDivElement>) {
        e.preventDefault()
        
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
                    bg-gray-300
                    items-center
                    justify-center"
            >
                <Flex
                    as="form"
                    className="
                        gap-9
                        bg-white
                        w-full
                        max-w-md
                        flex-col
                        p-12
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
                    <Button
                        colorScheme="blue"
                        type="submit"
                    >
                        Iniciar Sesión
                    </Button>
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