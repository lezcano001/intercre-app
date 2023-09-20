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
import { useUploadThing } from "~/utils/uploadthing";
import { GENDERS, GENDERS_MAP } from "~/utils/constants";
import { StandardSwitchInput } from "~/components/ui/StandardSwitchInput";

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
    
    const [imageFile, setImageFile] = useState<File | null>(null)

    const [formIsSubmitting, setFormIsSubmitting] = useState(false)
    const [CIInput, setCIInput] = useState("")
    const [nameInput, setNameInput] = useState("")
    const [lastNameInput, setLastNameInput] = useState("")
    const [birthdateInput, setBirthdateInput] = useState("")
    const [institutionInput, setInstitutionInput] = useState<number>(1)
    const [emailInput, setEmailInput] = useState("")
    const [telephoneInput, setTelephoneInput] = useState("")
    const [genderInput, setGenderInput] = useState<keyof typeof GENDERS_MAP>(GENDERS[0])
    const [isStudent, setIsStudent] = useState(false)

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

    async function handleCreateParticipant(e: FormEvent<HTMLDivElement>) {
        e.preventDefault()

        const [yyyy, mm, dd] = birthdateInput.split("-")

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
            
            await createParticipant.mutateAsync({
                ci: CIInput,
                firstname: nameInput,
                lastname: lastNameInput,
                telephone: telephoneInput,
                email: emailInput,
                image,
                birthDate: new Date(parseInt(yyyy!), parseInt(mm!), parseInt(dd!)),
                institution: institutionInput,
                gender: genderInput,
                isStudent
            })

            await router.push("/participantes")
        } catch (err) {
            if (err instanceof TRPCClientError) {
                const errData = err.data as {
                    zodError: {
                        fieldErrors: Record<string, string[]>
                    } | undefined
                }

                if (errData.zodError) {
                    const errorObject = Object.fromEntries(Object.entries(errData.zodError.fieldErrors).map(([key, value, ...rest]) => [key, value])) as FieldsErrors

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
                            items-center
                            justify-center"
                    >
                        <StandardImageInput
                            imageFile={imageFile}
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
                        <StandardSwitchInput
                            label="Es estudiante:"
                            id="isStudent"
                            isChecked={isStudent}
                            onChange={e => {
                                setIsStudent(e.target.checked)
                            }}
                        />
                    </GridItem>
                    <GridItem>
                        <StandardInput
                            value={CIInput}
                            onChange={e => setCIInput(e.target.value)}
                            label="Documento de Identidad:"
                            isError={zodErrors.ci}
                        />
                    </GridItem>
                    <GridItem>
                        <StandardInput
                            label="Nombres:"
                            value={nameInput}
                            onChange={e => setNameInput(e.target.value)}
                            isError={zodErrors.firstname}
                        />
                    </GridItem>
                    <GridItem>
                        <StandardInput
                            label="Apellidos:"
                            value={lastNameInput}
                            onChange={e => setLastNameInput(e.target.value)}
                            isError={zodErrors.lastname}
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
                            onChange={e => setGenderInput(e.target.value as keyof typeof GENDERS_MAP)}
                            isError={zodErrors.gender}
                        />
                    </GridItem>
                    <GridItem>
                        <StandardInput
                            label="Fecha de Nacimiento:"
                            value={birthdateInput}
                            onChange={e => setBirthdateInput(e.target.value)}
                            type="date"
                            isError={zodErrors.birthDate}
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