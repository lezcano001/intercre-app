import { Grid, GridItem, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay } from "@chakra-ui/react";
import { StandardInputViewer } from "../ui/StandardInputViewer";

interface ParticipantDataModalProps {
    isOpen: boolean;
    onClose: () => void;
    participantData: {
        CI: string;
        firstname: string;
        lastname: string;
        gender: string;
        birthDate: Date;
        institutionName: string;
        email: string;
        telephone: string;
    };
}

export function ParticipantDataModal({
    isOpen,
    onClose,
    participantData
}: ParticipantDataModalProps) {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
        >
            <ModalOverlay />
            <ModalContent
                className="
                    p-2"
            >
                <ModalHeader
                    className="
                        text-gray-600"
                >
                    Datos de Participante
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody>
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
                            <StandardInputViewer
                                label="Documento de Identidad:"
                                value={participantData.CI ?? ""}
                            />
                        </GridItem>
                        <GridItem>
                            <StandardInputViewer
                                label="Nombre:"
                                value={participantData.firstname ?? ""}
                            />
                        </GridItem>
                        <GridItem>
                            <StandardInputViewer
                                label="Apellidos:"
                                value={participantData.lastname ?? ""}
                            />
                        </GridItem>
                        <GridItem>
                            <StandardInputViewer
                                label="Sexo:"
                                value={participantData.gender ?? ""}
                            />
                        </GridItem>
                        <GridItem>
                            <StandardInputViewer
                                label="Fecha de nacimiento:"
                                value={participantData.birthDate ? new Intl.DateTimeFormat("es-PY", {
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "numeric"
                                }).format(participantData.birthDate) : ""}
                            />
                        </GridItem>
                        <GridItem>
                            <StandardInputViewer
                                label="Institución:"
                                value={participantData.institutionName ?? ""}
                            />
                        </GridItem>
                        <GridItem>
                            <StandardInputViewer
                                label="Email:"
                                value={participantData.email ?? ""}
                            />
                        </GridItem>
                        <GridItem>
                            <StandardInputViewer
                                label="Teléfono:"
                                value={participantData.telephone ?? ""}
                            />
                        </GridItem>
                    </Grid>
                </ModalBody>
            </ModalContent>
        </Modal>
    )
}