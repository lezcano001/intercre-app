import { Flex, IconButton, Heading, Grid, GridItem, Button, Input, useToast } from "@chakra-ui/react"
import { RiArrowLeftLine } from "react-icons/ri"
import { DashboardLayout } from "~/components/layouts/DashboardLayout"
import { StandardInput } from "~/components/ui/StandardInput"

import NextLink from 'next/link'
import { type FormEvent, useState, useEffect } from "react"
import { useRouter } from "next/router"
import { api } from "~/utils/api"
import { Card } from "~/components/ui/Card"
import { StandardSelectInput } from "~/components/ui/StandardSelectInput"
import { TRPCClientError } from "@trpc/client"
import { StandardImageInput } from "~/components/ui/StandardImageInput"
import { useUploadThing } from "~/utils/uploadthing"

type EditParticipantFormFields = {
    CI: string,
    birthDate: Date,
    email: string,
    firstname: string,
    institution: {
        ISO: number;
    },
    lastname: string,
    telephone: string
}

export default function EditParticipant() {
    const router = useRouter()

    const { startUpload } = useUploadThing(
        "imageUploader",
        {
            onUploadError: () => {
                toast({
                    title: "Ocurrió un error mientras se guardaba la imágen",
                    colorScheme: "red",
                    isClosable: true
                })
            },
        }
    )

    const { query } = router

    const toast = useToast()

    const getAvailableInstitutions = api.institutions.getAvailableInstitutions.useQuery()

    // In the beginning the value of query in undefined, so the first value passed to parseInt is "", and the input
    // for the getParticipant route is NaN, which gives an error.
    // The solution is pass another number, which is impossible to exists, or use an string as id.
    const participant = api.participants.getParticipant.useQuery(query.participantCI as string ?? "")

    const [imageFile, setImageFile] = useState<File | null>(null)

    const [formIsSubmitting, setFormIsSubmitting] = useState(false)
    const [CIInput, setCIInput] = useState("")
    const [nameInput, setNameInput] = useState("")
    const [lastNameInput, setLastNameInput] = useState("")
    const [birthdateInput, setBirthdateInput] = useState("")
    const [institutionInput, setInstitutionInput] = useState(10)
    const [emailInput, setEmailInput] = useState("")
    const [telephoneInput, setTelephoneInput] = useState("")

    function resetFields({
        CI,
        birthDate,
        email,
        firstname,
        institution,
        lastname,
        telephone
    }: EditParticipantFormFields) {
            setCIInput(CI)
            setNameInput(firstname)
            setLastNameInput(lastname)
            setBirthdateInput(birthDate.toISOString().substring(0, 10))
            setInstitutionInput(institution.ISO)
            setEmailInput(email)
            setTelephoneInput(telephone)
    }

    // Reset file, when the data of of the participant changes
    useEffect(() => {
        if (participant?.data) {
            // const { ...rest } = participant.data

            resetFields({
                ...participant.data,
            })
        }
    }, [participant?.data])

    const updateParticipant = api.participants.updateParticipant.useMutation()

    async function handleUpdateParticipant(e: FormEvent<HTMLDivElement>) {
        e.preventDefault()

        // In the future, check if the images are equal

        if (!participant?.data) {
            return
        }

        const [yyyy, mm, dd] = birthdateInput.split("-")

        // Check if the data on the modification is equal, don't make the request of change, because it will
        // mean extra innecesary request.
        setFormIsSubmitting(true)
        try {
            let image = undefined;

            // Also should delete the image from the database
            if (imageFile) {
                const data = await startUpload([imageFile])

                if (data && data.length > 0) {
                    if (data[0]?.url) {
                        image = {
                            imageURL: data[0].url,
                            imageFileKey: data[0].key
                        }
                    }
                }
            }

            await updateParticipant.mutateAsync({
                CI: query?.participantCI as string,
                data: {
                    ci: CIInput,
                    firstname: nameInput,
                    lastname: lastNameInput,
                    telephone: telephoneInput,
                    email: emailInput,
                    birthDate: new Date(parseInt(yyyy!), parseInt(mm!), parseInt(dd!)),
                    institution: institutionInput,
                    image
                },
                previousImageFileKey: participant.data.image?.fileKey
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

            toast({
                title: 'Error en el servidor',
                description: 'Contactese con el soporte técnico',
                isClosable: true,
                status: 'error'
            })

            if (participant.data) {
                resetFields(participant.data)
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
                        Editar participante
                    </Heading>
                </Flex>
                <Grid
                    className="
                        w-full"
                    as="form"
                    templateColumns="repeat(2, 1fr)"
                    gap="9"
                    onSubmit={e => {
                        void handleUpdateParticipant(e)
                    }}
                >
                    <GridItem
                        colSpan={2}
                        className="
                            flex
                            items-center
                            justify-center"
                    >
                        <StandardImageInput
                            imageFile={imageFile}
                            imageURL={participant?.data?.image?.imageURL}
                            alt={`Foto de perfíl de ${nameInput} ${lastNameInput}`}
                            onChange={(e) => {
                                if (e.target.files?.[0]) {
                                    setImageFile(e.target.files[0])
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
                            Guardar Cambios
                        </Button>
                    </GridItem>
                </Grid>
            </Card>
        </DashboardLayout>
    )
}