import { Button, Flex, Grid, GridItem, Heading, IconButton, useToast } from "@chakra-ui/react";
import { DashboardLayout } from "~/components/layouts/DashboardLayout";
import { Card } from "~/components/ui/Card";
import NextLink from 'next/link'
import { RiArrowLeftLine } from 'react-icons/ri'
import { type FormEvent, useState, useEffect } from "react";

import { api } from '~/utils/api'
import { useRouter } from "next/router";
import { StandardInput } from "~/components/ui/StandardInput";
import { StandardImageInput } from "~/components/ui/StandardImageInput";
import { StandardSelectInput } from "~/components/ui/StandardSelectInput";
import { TRPCClientError } from "@trpc/client";

export default function CreateParticipant() {
    const toast = useToast()

    const getAvailableInstitutions = api.institutions.getAvailableInstitutions.useQuery()
    
    const [currentImageURL, setCurrentImageURL] = useState("")

    const [formIsSubmitting, setFormIsSubmitting] = useState(false)
    const [CIInput, setCIInput] = useState("")
    const [nameInput, setNameInput] = useState("")
    const [lastNameInput, setLastNameInput] = useState("")
    const [birthdateInput, setBirthdateInput] = useState("")
    const [institutionInput, setInstitutionInput] = useState<number>(1)
    const [emailInput, setEmailInput] = useState("")
    const [telephoneInput, setTelephoneInput] = useState("")

    useEffect(() => {
        if (getAvailableInstitutions?.data && getAvailableInstitutions.data.length > 0) {
            const defaultInstitution = getAvailableInstitutions.data[0]!
            setInstitutionInput(defaultInstitution.ISO)
        }

    }, [getAvailableInstitutions?.data])

    const createParticipant = api.participants.createParticipant.useMutation()

    const router = useRouter()

    async function handleCreateParticipant(e: FormEvent<HTMLDivElement>) {
        e.preventDefault()

        const [yyyy, mm, dd] = birthdateInput.split("-")

        setFormIsSubmitting(true)
        try {
            await createParticipant.mutateAsync({
                ci: CIInput,
                firstname: nameInput,
                lastname: lastNameInput,
                telephone: telephoneInput,
                email: emailInput,
                imageURL: "http://localhost:5000",
                birthDate: new Date(parseInt(yyyy!), parseInt(mm!), parseInt(dd!)),
                institution: institutionInput
            })

            await router.push("/participantes")
        } catch (err) {
            if (err instanceof TRPCClientError) {
                toast({
                    title: err.message,
                    position: 'bottom-right',
                    isClosable: true,
                    status: 'error'
                })
            }
        }

        setFormIsSubmitting(false)
    }

    return (
        <DashboardLayout>
            <Card
                className="flex-col"
            >
                <Flex
                    className="
                        flex
                        items-center
                        gap-9
                        w-full
                        mb-12"
                >
                    <IconButton
                        as={NextLink}
                        href="/participantes"
                        icon={
                            <RiArrowLeftLine
                                className="
                                    w-6
                                    h-6"
                            />
                        }
                        aria-label="Volver"
                    />
                    <Heading
                        as="h1"
                        className="
                            !text-2xl
                            text-gray-600"
                    >
                        Agregar participante
                    </Heading>
                </Flex>
                <Grid
                    className="
                        w-full"
                    as="form"
                    templateColumns="repeat(2, 1fr)"
                    gap="9"
                    onSubmit={e => {
                        void handleCreateParticipant(e)
                    }}
                >
                    <GridItem
                        colSpan={2}
                        className="
                            flex
                            justify-center"
                    >
                        <StandardImageInput
                            currentImageURL={currentImageURL === "" ? "/fallback-participant-profile-image.svg" : currentImageURL}
                            imageLabel=""
                            onChange={(e) => {
                                // eslint-disable-next-line @typescript-eslint/prefer-optional-chain
                                if (e.target.files && e.target.files[0]) {
                                    setCurrentImageURL(URL.createObjectURL(e.target.files[0]))
                                }
                            }}
                        />
                    </GridItem>
                    <GridItem
                        colSpan={2}
                    >
                        <StandardInput
                            value={CIInput}
                            onChange={e => setCIInput(e.target.value)}
                            label="Documento de Identidad:"
                            containerClassName="
                                max-w-md"
                        />
                    </GridItem>
                    <GridItem>
                        <StandardInput
                            label="Nombres:"
                            value={nameInput}
                            onChange={e => setNameInput(e.target.value)}
                        />
                    </GridItem>
                    <GridItem>
                        <StandardInput
                            label="Apellidos:"
                            value={lastNameInput}
                            onChange={e => setLastNameInput(e.target.value)}
                        />
                    </GridItem>
                    <GridItem>
                        <StandardInput
                            label="Fecha de Nacimiento:"
                            value={birthdateInput}
                            onChange={e => setBirthdateInput(e.target.value)}
                            type="date"
                        />
                    </GridItem>
                    <GridItem>
                        <StandardSelectInput
                            label="Institución"
                            options={getAvailableInstitutions.data ?
                                getAvailableInstitutions.data?.map((institution) => {
                                    return {
                                        label: institution.name,
                                        value: institution.ISO
                                    }
                                }) : []
                            }
                            value={institutionInput}
                            onChange={e => setInstitutionInput(parseInt(e.target.value))}
                        />
                    </GridItem>
                    <GridItem>
                        <StandardInput
                            label="Email:"
                            value={emailInput}
                            onChange={e => setEmailInput(e.target.value)}
                        />
                    </GridItem>
                    <GridItem>
                        <StandardInput
                            label="Teléfono:"
                            value={telephoneInput}
                            onChange={e => setTelephoneInput(e.target.value)}
                        />
                    </GridItem>
                    <GridItem
                        colSpan={2}
                        className="
                            flex
                            gap-4
                            justify-end"
                    >
                        <Button
                            as={NextLink}
                            href="/participantes"
                        >
                            Cancelar
                        </Button>
                        <Button
                            colorScheme="green"
                            type="submit"
                            isLoading={formIsSubmitting}
                            loadingText="Guardando"
                        >
                            Guardar Participante
                        </Button>
                    </GridItem>
                </Grid>
            </Card>
        </DashboardLayout>
    )
}