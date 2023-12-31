import { Flex, IconButton, Heading, Grid, GridItem, Button, useToast, Box } from "@chakra-ui/react"
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
import { GENDERS, GENDERS_MAP } from "~/utils/constants"

type EditParticipantFormFields = {
    CI: string,
    birthDate: Date,
    email: string,
    firstname: string,
    institution: {
        ISO: number;
    },
    lastname: string,
    telephone: string,
    gender: (typeof GENDERS)[number],
}

type FieldsErrors = {
    ci?: string;
    firstname?: string;
    lastname?: string;
    telephone?: string;
    email?: string;
    image?: string;
    birthDate?: string;
    institution?: string;
    gender?: string;
}

export default function EditParticipant() {
    const router = useRouter()

    const { query } = router

    const toast = useToast()

    const getAvailableInstitutions = api.institutions.getAvailableInstitutions.useQuery()

    // In the beginning the value of query in undefined, so the first value passed to parseInt is "", and the input
    // for the getParticipant route is NaN, which gives an error.
    // The solution is pass another number, which is impossible to exists, or use an string as id.
    const participant = api.participants.getParticipant.useQuery(query.participantCI as string ?? "")

    const [formIsSubmitting, setFormIsSubmitting] = useState(false)
    const [CIInput, setCIInput] = useState("")
    const [nameInput, setNameInput] = useState("")
    const [lastNameInput, setLastNameInput] = useState("")
    const [birthdateInput, setBirthdateInput] = useState("")
    const [institutionInput, setInstitutionInput] = useState(10)
    const [emailInput, setEmailInput] = useState("")
    const [telephoneInput, setTelephoneInput] = useState("")
    const [genderInput, setGenderInput] = useState<(typeof GENDERS)[number]>(GENDERS[0])

    const [zodErrors, setZodErrors] = useState<FieldsErrors>({} as FieldsErrors)

    function resetFields({
        CI,
        birthDate,
        email,
        firstname,
        institution,
        lastname,
        telephone,
        gender,
    }: EditParticipantFormFields) {
            setCIInput(CI)
            setNameInput(firstname)
            setLastNameInput(lastname)
            setBirthdateInput(birthDate.toISOString().substring(0, 10))
            setInstitutionInput(institution.ISO)
            setEmailInput(email)
            setTelephoneInput(telephone)
            setGenderInput(gender)
    }

    // Reset file, when the data of of the participant changes
    useEffect(() => {
        if (participant?.data) {
            // const { ...rest } = participant.data

            resetFields({
                ...participant.data,
                email: participant.data.email ?? "",
                telephone: participant.data.telephone ?? "",
                gender: participant.data.gender.value as (typeof GENDERS)[number],
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
            await updateParticipant.mutateAsync({
                currentCI: query?.participantCI as string,
                ci: CIInput,
                firstname: nameInput,
                lastname: lastNameInput,
                telephone: telephoneInput ?? undefined,
                email: emailInput ?? undefined,
                birthDate: new Date(parseInt(yyyy!), parseInt(mm!), parseInt(dd!)),
                institution: institutionInput,
                gender: genderInput,
            })
    
            await router.push("/alumnos")
        } catch (err) {
            if (err instanceof TRPCClientError) {
                const errData = err.data as {
                    zodError: {
                        fieldErrors: Record<string, string[]>
                    } | undefined
                }

                if (errData.zodError) {
                    const errorObject = Object.fromEntries(Object.entries(errData.zodError.fieldErrors).map(([key, value]) => [key, value])) as FieldsErrors

                    setZodErrors({
                        ...errorObject
                    })
                } else {
                    toast({
                        title: err.message,
                        position: 'bottom-right',
                        isClosable: true,
                        status: 'error'
                    })
                }
            } else {
                toast({
                    title: 'Error en el servidor',
                    description: 'Contactese con el soporte técnico',
                    isClosable: true,
                    status: 'error'
                })
            }

            if (participant.data) {
                resetFields({
                    ...participant.data,
                    email: participant.data.email ?? "",
                    telephone: participant.data.telephone ?? "",
                    gender: participant.data.gender.value as (typeof GENDERS)[number],
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
                        items-center
                        gap-9
                        w-full
                        mb-12"
                >
                    <IconButton
                        as={NextLink}
                        href="/alumnos/"
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
                            !text-xl
                            sm:!text-2xl
                            text-gray-600"
                    >
                        Editar Alumno
                    </Heading>
                </Flex>
                <Box
                    className="
                        w-full"
                        as="form"
                        onSubmit={e => {
                            void handleUpdateParticipant(e)
                        }}
                >
                    <Grid
                        className="
                            w-full
                            flex
                            flex-col
                            md:grid-cols-[repeat(auto-fit,minmax(20rem,1fr))]
                            gap-9
                            mb-10"
                    >
                        <GridItem>
                            <StandardInput
                                value={CIInput}
                                onChange={e => setCIInput(e.target.value)}
                                label="Documento de Identidad:"
                                isError={zodErrors.ci}
                                isRequired
                            />
                        </GridItem>
                        <GridItem>
                            <StandardInput
                                label="Nombres:"
                                value={nameInput}
                                onChange={e => setNameInput(e.target.value)}
                                isError={zodErrors.firstname}
                                isRequired
                            />
                        </GridItem>
                        <GridItem>
                            <StandardInput
                                label="Apellidos:"
                                value={lastNameInput}
                                onChange={e => setLastNameInput(e.target.value)}
                                isError={zodErrors.lastname}
                                isRequired
                            />
                        </GridItem>
                        <GridItem>
                            <StandardSelectInput
                                label="Sexo:"
                                options={GENDERS.map((gender) => {
                                    return {
                                        label: GENDERS_MAP[gender],
                                        value: gender
                                    }
                                })}
                                value={genderInput}
                                onChange={e => setGenderInput(e.target.value as (typeof GENDERS)[number])}
                                isError={zodErrors.gender}
                                isRequired
                            />
                        </GridItem>
                        <GridItem>
                            <StandardInput
                                label="Fecha de Nacimiento:"
                                value={birthdateInput}
                                onChange={e => setBirthdateInput(e.target.value)}
                                type="date"
                                isError={zodErrors.birthDate}
                                isRequired
                            />
                        </GridItem>
                        <GridItem>
                            <StandardSelectInput
                                label="Institución:"
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
                                isError={zodErrors.institution}
                                isRequired
                            />
                        </GridItem>
                        <GridItem>
                            <StandardInput
                                label="Email:"
                                value={emailInput}
                                onChange={e => setEmailInput(e.target.value)}
                                isError={zodErrors.email}
                            />
                        </GridItem>
                        <GridItem>
                            <StandardInput
                                label="Teléfono:"
                                value={telephoneInput}
                                onChange={e => setTelephoneInput(e.target.value)}
                                isError={zodErrors.telephone}
                            />
                        </GridItem>
                    </Grid>
                    <Flex
                        className="
                            flex-col
                            sm:flex-row
                            gap-4
                            justify-end"
                    >
                        <Button
                            as={NextLink}
                            href="/alumnos"
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
                    </Flex>
                </Box>
            </Card>
        </DashboardLayout>
    )
}