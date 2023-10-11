import { Button, Flex, Grid, GridItem, Heading, useDisclosure, useToast } from "@chakra-ui/react";
import { TRPCClientError } from "@trpc/client";
import { type FormEvent, useEffect, useState, useRef } from "react";
import { ParticipantDataModal } from "~/components/QueriesOnly/ParticipantDataModal";
import { QueriesOnlyDashboardLayout } from "~/components/layouts/QueriesOnlyDashboardLayout";
import { Card } from "~/components/ui/Card";
import { StandardInput } from "~/components/ui/StandardInput";
import { StandardSelectInput } from "~/components/ui/StandardSelectInput";
import { api } from "~/utils/api";
import { GENDERS_MAP } from "~/utils/constants";

type FieldsErrors = {
    ci?: string;
    institutionISO?: string;
}

type SearchFilters = {
    CI?: string;
    institutionISO?: number;
}

export default function PublicDataQuery() {
    const getAllInstitutions = api.institutions.getAllInstitutions.useQuery()

    const { onClose, onOpen, isOpen } = useDisclosure()

    const toast = useToast()
    
    const [searchFilters, setSearchFilters] = useState<SearchFilters>({} as SearchFilters)

    const institutionInputRef = useRef<HTMLSelectElement>(null)
    const CIInputRef = useRef<HTMLInputElement>(null)

    const getParticipant = api.participants.getParticipantPublicData.useQuery({
        CI: searchFilters.CI!,
        institutionISO: searchFilters.institutionISO!
    }, {
        enabled: false,
        retryDelay: 2,
        staleTime: Infinity,
    })

    const [zodErrors, setZodErrors] = useState<FieldsErrors>({})

    useEffect(() => {
        if (Object.keys(searchFilters).length === 0) return
        
        async function makeRequest() {
            try {
                await getParticipant.refetch({
                    throwOnError: true
                })

                onOpen()
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

        }

        void makeRequest()

        // eslint-disable-next-line
    }, [searchFilters])

    function handleSearchParticipant(e: FormEvent<HTMLDivElement>) {
        e.preventDefault()

        toast.closeAll()

        setSearchFilters({
            CI: CIInputRef.current!.value,
            institutionISO: institutionInputRef.current!.value ? parseInt(institutionInputRef.current!.value) : undefined
        })
    }

    return (
        <>
            <QueriesOnlyDashboardLayout>
                <Card
                    className="
                        flex-col"
                >
                    <Heading
                        as="h1"
                        className="
                            !text-2xl
                            text-gray-600
                            mb-10"
                    >
                        Consulta de Participantes
                    </Heading>
                    <Flex
                        as="form"
                        onSubmit={e => {
                            void handleSearchParticipant(e)
                        }}
                        className="
                            w-full
                            flex-col
                            gap-10"
                    >
                        <Grid
                            className="
                                w-full
                                flex
                                flex-col
                                md:grid-cols-[repeat(auto-fit,minmax(20rem,1fr))]
                                gap-9"
                        >
                            <GridItem>
                                <StandardInput
                                    ref={CIInputRef}
                                    label="Documento de Identidad:"
                                    isRequired
                                    isError={zodErrors.ci}
                                />
                            </GridItem>
                            <GridItem>
                                <StandardSelectInput
                                    ref={institutionInputRef}
                                    label="Institución"
                                    options={getAllInstitutions.data ?
                                        getAllInstitutions.data?.map((institution) => {
                                            return {
                                                label: "CRE " + institution.name,
                                                value: institution.ISO
                                            }
                                        }) : []
                                    }
                                    isRequired
                                    isError={zodErrors.institutionISO}
                                    defaultValue={getAllInstitutions.data ? getAllInstitutions.data[0]?.ISO : undefined}
                                />
                            </GridItem>
                        </Grid>
                        <Flex
                            className="
                                justify-end"
                        >
                            <Button
                                type="submit"
                                colorScheme="green"
                                isLoading={getParticipant.isFetching}
                                loadingText="Buscando Participante"
                            >
                                Buscar Participante
                            </Button>
                        </Flex>
                    </Flex>
                </Card>
            </QueriesOnlyDashboardLayout>
            <ParticipantDataModal
                isOpen={isOpen}
                onClose={onClose}
                participantData={{
                    birthDate: new Date(),
                    CI: getParticipant.data?.CI ?? "",
                    email: getParticipant.data?.email ?? "",
                    firstname: getParticipant.data?.firstname ?? "",
                    gender: getParticipant.data?.gender ? GENDERS_MAP[getParticipant.data?.gender as keyof typeof GENDERS_MAP] : "",
                    institutionName: "CRE " + (getParticipant.data?.institution?.name ?? ""),
                    lastname: getParticipant.data?.lastname ?? "",
                    telephone: getParticipant.data?.telephone ?? ""
                }}
            />
        </>
    )
}