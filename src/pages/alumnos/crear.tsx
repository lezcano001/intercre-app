import { Box, Button, Flex, Grid, GridItem, Heading, IconButton, useToast } from "@chakra-ui/react";
import { DashboardLayout } from "~/components/layouts/DashboardLayout";
import { Card } from "~/components/ui/Card";
import NextLink from 'next/link'
import { RiArrowLeftLine } from 'react-icons/ri'
import { type FormEvent, useState, useEffect } from "react";

import { api } from '~/utils/api'
import { useRouter } from "next/router";
import { StandardInput } from "~/components/ui/StandardInput";
import { StandardSelectInput } from "~/components/ui/StandardSelectInput";
import { TRPCClientError } from "@trpc/client";
import { GENDERS, GENDERS_MAP } from "~/utils/constants";

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
    isStudent?: string;
}

export default function CreateParticipant() {
    const toast = useToast()

    const getAvailableInstitutions = api.institutions.getAvailableInstitutions.useQuery()
    
    const [formIsSubmitting, setFormIsSubmitting] = useState(false)
    const [CIInput, setCIInput] = useState("")
    const [nameInput, setNameInput] = useState("")
    const [lastNameInput, setLastNameInput] = useState("")
    const [birthdateInput, setBirthdateInput] = useState("")
    const [institutionInput, setInstitutionInput] = useState<number>(1)
    const [emailInput, setEmailInput] = useState("")
    const [telephoneInput, setTelephoneInput] = useState("")
    const [genderInput, setGenderInput] = useState<(typeof GENDERS)[number]>(GENDERS[0])

    const [zodErrors, setZodErrors] = useState<FieldsErrors>({})

    // Set the first available option as the default
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
                    description: 'Vuelva a intentarlo más tarde, si el error persiste contactese con el soporte técnico.',
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
                        mb-16"
                >
                    <IconButton
                        as={NextLink}
                        href="/alumnos"
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
                        Agregar Alumno
                    </Heading>
                </Flex>
                <Box
                    className="
                        w-full"
                    as="form"
                    onSubmit={e => {
                        void handleCreateParticipant(e)
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
                            Guardar Participante
                        </Button>
                    </Flex>
                </Box>
            </Card>
        </DashboardLayout>
    )
}