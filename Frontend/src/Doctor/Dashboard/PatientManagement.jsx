import { useEffect, useState } from 'react';
import axios from "axios";
import HeaderForDashboardComponent from "./HeaderForDashboardComponent";

const PatientManagement = () => {
    const [OfflinePatientData, setOfflinePatientData] = useState([]);
    const [onlinePatientData, setOnlinePatientData] = useState([]);
    const [selectedOfflinePatient, setSelectedOfflinePatient] = useState(null); // To track the selected offline patient
    const [selectedOnlinePatient, setSelectedOnlinePatient] = useState(null); // To track the selected online patient
    const [allAppointmentInfo, setAllAppointmentInfo] = useState("")

    const [patientDataForPrescription, setPatientDataForPrescriptioin] = useState(null);
    const [openViewPrescription, setOpenViewPrescription] = useState(false);
    const [openViewPrescriptionOfflinePatient, setOpenViewPrescriptionOfflinePatient] = useState(false);

    const [singlePrescriptionData, setSinglePrescriptionData] = useState("");
    const [singlePrescriptionDataOfflinePatient, setSinglePrescriptionDataOfflinePatient] = useState("");

    const [medication, setMedication] = useState("")
    const [diagnosis, setDiagnosis] = useState("")
    const [instructions, setInstructions] = useState("")
    useEffect(() => {
        const handleOfflinePatientCardInfo = async () => {
            try {
                const resp = await axios.get("/api/user/patient-show/");
                setOfflinePatientData(resp.data.data);
            } catch (err) {
                console.log(err);
            }
        };
        const handleOnlinePatientCardInfo = async () => {
            try {
                const response = await axios.get("/api/user/doctor/online-booking-show");
                console.log(response.data.msg)
                setOnlinePatientData(response.data.msg);

            } catch (error) {
                console.log("Error while getting online patients: ", error);
            }
        };
        const handleAppoinmentInfo = async () => {
            try {
                const response = await axios.get("/api/user/doctor/online-booking-info-show");
                console.log("All appointment =  ", response.data.appointmentData)
                setAllAppointmentInfo(response.data.appointmentData);
            } catch (error) {
                console.log("Error while getting online appointment info: ", error);
            }
        };

        handleOfflinePatientCardInfo();
        handleOnlinePatientCardInfo();
        handleAppoinmentInfo();
    }, []);

    const handleGetAllPrescription = async (appointmentId) => {
        console.log("Appointment id = ", appointmentId)
        try {

            const response = await axios.get(`/api/user/doctor/show-prescription${appointmentId}`)
            console.log("Response of singl prescription = ", response.data.singlePrescription);

            if (response.data.singlePrescription.length != 0) {
                setSinglePrescriptionData(response.data.singlePrescription[0])
                console.log(response.data.singlePrescription[0])
            } else {
                // console.log("Udefind occure.??????????????????????/")
                setSinglePrescriptionData({
                    medication: "No Data Available",
                    instructions: "No Data Available",
                    diagnosis: "No Data Available",
                    createdAt: "No Data Available"
                })
            }

        } catch (error) {
            console.log("Error while getting all presc data = ", error);
        }
    }

    
    const handleGetAllPrescriptionOfflinePatient = async (appointmentId) => {
        console.log("Appointment id = ", appointmentId)
        try {

            const response = await axios.get(`/api/user/doctor/offline-patient-show-prescription${appointmentId}`)
            console.log("Response of single for offline patient prescription = ", response.data.singlePrescription);

            if (response.data.singlePrescription.length != 0) {
                setSinglePrescriptionDataOfflinePatient(response.data.singlePrescription[0])
                console.log(response.data.singlePrescription[0])
            } else {
                // console.log("Udefind occure.??????????????????????/")
                setSinglePrescriptionDataOfflinePatient({
                    medication: "No Data Available",
                    instructions: "No Data Available",
                    diagnosis: "No Data Available",
                    createdAt: "No Data Available"
                })
            }

        } catch (error) {
            console.log("Error while getting all presc data = ", error);
        }
    }

    async function handlePrescriptionDataSubmit(patientId, appointmentId) {
        try {
            const resp = axios.post("/api/user/doctor/prescription", {
                patientId,
                appointmentId,
                medication,
                diagnosis,
                instructions
            })
            console.log("Response after sending presc data to backend = ", resp);
            setDiagnosis("")
            setInstructions("")
            setMedication("")
        } catch (error) {
            console.log("Error occured while putting presc data to backend = ", error);
        }
    }
    async function handlePrescriptionDataOfflinePatientSubmit(appointmentId,doctorId) {
        try {
            console.log("dcotor id = , appointmetn id = ",doctorId, appointmentId)
            const resp = await axios.post("/api/user/doctor/prescription-offline-patient", {
                doctorId,
                appointmentId,
                medication,
                diagnosis,
                instructions
            })
            console.log("Response after sending presc data to backend = ", resp);
            setDiagnosis("")
            setInstructions("")
            setMedication("")
            
        } catch (error) {
            console.log("Error occured while putting presc data to backend = ", error);
        }
    }

    const toggleOfflinePatientDetails = (patientId) => {
        setSelectedOfflinePatient(selectedOfflinePatient === patientId ? null : patientId);
    };

    const toggleOnlinePatientDetails = (patientId) => {
        setSelectedOnlinePatient(selectedOnlinePatient === patientId ? null : patientId);
    };

    const openNewPrescriptionForm = (patientData) => {
        // console.log("hello",patientData)
        setPatientDataForPrescriptioin(patientData)
    };
    const closeNewPrescriptionForm = () => {
        setPatientDataForPrescriptioin(null);
    };

    const openNewPrescriptionFormOfflinePatient = (patientData) => {
        console.log("hello",patientData)
        setPatientDataForPrescriptioin(patientData)
    };
    const closeNewPrescriptionFormOfflinePatient = () => {
        setPatientDataForPrescriptioin(null);
    };



    return (
        <div className="bg-slate-800 text-white">
            <HeaderForDashboardComponent />
            <div>Patient History</div>
            <div className="grid grid-cols-4 gap-4 mx-10 place-items-center">
                {/* Offline Patients */}
                {OfflinePatientData.map((item) => (
                    <div key={item.appointmentId} className="flex flex-col border-2 border-[#4292dc] rounded-lg w-fit items-center py-0 px-4 my-5 duration-300 hover:shadow-md hover:shadow-[#4292dc] hover:-translate-y-1" >
                        <div className="text-sm">{item.patientType}</div>
                        <img src="" alt="img" className="h-16 w-16 border-2 border-[#2370b8] rounded-full mt-2" />
                        <div>{item.fullName}</div>
                        <div>{item.contactNumber}</div>
                        <div>{item.dob}</div>
                        <button className="bg-slate-800 text-white border-2 border-[#1f6eb8] rounded-full my-5 py-2 px-4 duration-300 hover:shadow-md hover:shadow-[#4292dc] hover:-translate-y-1" onClick={() => toggleOfflinePatientDetails(item._id)}>
                            Check Patient
                        </button>
                        {selectedOfflinePatient === item._id && (
                            <div className={`bg-slate-700 absolute z-40 flex flex-col border-2 border-black rounded-lg ml-[400px] w-[450px]`}>
                                <div className="mb-2"><strong>Patient Name:</strong> {item.fullName}</div>
                                <div className="mb-2"><strong>Patient Email:</strong> {item.email}</div>
                                <div className="mb-2"><strong>Gender:</strong> {item.gender}</div>
                                <div className="mb-2"><strong>Date of Birth:</strong> {item.dob}</div>
                                <div className="mb-2"><strong>Contact:</strong> {item.contactNumber}</div>
                                <div className="mb-2"><strong>Address:</strong> {item.address}</div>
                                <div className="mb-2"><strong>Emergency Contact Name:</strong> {item.emergencyContactName}</div>
                                <div className="mb-2"><strong>Emergency Contact Phone:</strong> {item.emergencyContactNumber}</div>
                                <button className="bg-slate-800 text-white border-2 border-black rounded-full w-fit" onClick={() => toggleOfflinePatientDetails(item._id)}>Exit Details</button>
                                <button className="bg-slate-800  text-white border-2 border-[#1f6eb8] rounded-full w-fit py-2 px-4 my-1 mb-4 mx-2 duration-300 hover:shadow-md hover:shadow-[#4292dc] hover:-translate-y-1" onClick={() => openNewPrescriptionFormOfflinePatient(item)}>
                                    Add Prescription
                                </button>
                                <button className="bg-slate-800  text-white border-2 border-[#1f6eb8] rounded-full w-fit py-2 px-4 my-1 mb-4 mx-2 duration-300 hover:shadow-md hover:shadow-[#4292dc] hover:-translate-y-1" onClick={() => { setOpenViewPrescriptionOfflinePatient(true), handleGetAllPrescriptionOfflinePatient(item._id) }}>
                                    View Prescription
                                </button>

                            </div>
                        )}
                    </div>
                ))}

                {/* Online Patients */}
                {onlinePatientData.map((item) => (
                    <div key={item.appointmentId} className="flex flex-col border-2 border-[#4292dc] rounded-lg w-fit items-center py-0 px-4 my-5 duration-300 hover:shadow-md hover:shadow-[#4292dc] hover:-translate-y-1" >
                        <div className="text-sm">{item.patientType}</div>
                        <img src="" alt="img" className="h-16 w-16 border-2 border-[#2370b8] rounded-full mt-2" />

                        <div className="mb-2"><strong>Full Name:</strong> {item.fullName}</div>
                        <div className="mb-2"><strong>Contact:</strong> {item.phone}</div>
                        <div className="mb-2"><strong>DOB:</strong> {item.dateOfBirth}</div>
                        <div className="mb-2"><strong>Appointment Time:</strong> {allAppointmentInfo.find(appointment => appointment._id === item.appointmentId)?.timeOfAppointment}</div>
                        <div className="mb-2"><strong>Appointment Date:</strong> {allAppointmentInfo.find(appointment => appointment._id === item.appointmentId)?.dateOfAppointment}</div>
                        <button className="bg-slate-800 text-white border-2 border-[#1f6eb8] rounded-full my-5 py-2 px-4 duration-300 hover:shadow-md hover:shadow-[#4292dc] hover:-translate-y-1" onClick={() => toggleOnlinePatientDetails(item.appointmentId)}>
                            Check Patient
                        </button>
                        {selectedOnlinePatient === item.appointmentId && (
                            <>

                                <div className="bg-slate-800 absolute z-40 flex flex-col border-2 border-[black] rounded-lg ml-[400px] w-[450px]">
                                    <button className='ml-[90%] text-red-600 text-xl mt-1' onClick={() => toggleOnlinePatientDetails(item._id)}>X</button>


                                    {/* Display online patient details */}
                                    <div className='py-2 px-2 mx-10 mb-5'>
                                        <div className='my-1'>Full Name: {item.fullName}</div>
                                        <div className='my-1'>Date of Birth: {item.dateOfBirth}</div>
                                        <div className='my-1'>Contact: {item.phone}</div>
                                        <div className='my-1'>Emergency Name: {item.emergenecyContactName}</div>
                                        <div className='my-1'>Emergency Contact: {item.emergencyContactPhone}</div>
                                    </div>
                                    {/* More details */}
                                    <div>

                                        <button className="bg-slate-800  text-white border-2 border-[#1f6eb8] rounded-full w-fit py-2 px-4 my-1 mb-4 mx-2 duration-300 hover:shadow-md hover:shadow-[#4292dc] hover:-translate-y-1" onClick={() => openNewPrescriptionForm(item)}>
                                            Add Prescription
                                        </button>
                                        <button className="bg-slate-800  text-white border-2 border-[#1f6eb8] rounded-full w-fit py-2 px-4 my-1 mb-4 mx-2 duration-300 hover:shadow-md hover:shadow-[#4292dc] hover:-translate-y-1" onClick={() => {setOpenViewPrescription(true), handleGetAllPrescription(item.appointmentId) }}>
                                            View Prescription
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                ))}
                {patientDataForPrescription && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
                            <div className="flex justify-between items-center">
                                <h2 className="text-xl font-semibold">Appointment Details</h2>
                                <button className="text-red-500 text-lg" onClick={() => closeNewPrescriptionForm()}>
                                    X
                                </button>
                            </div>
                            <div className="mt-4 text-black flex flex-col">
                                <input type="text" placeholder='Medications' className='border-2 border-black py-2 px-2 my-1 rounded-lg' value={medication} onChange={(e) => setMedication(e.target.value)} />
                                <input type="text" placeholder='instructions' className='border-2 border-black py-2 px-2 my-1 rounded-lg' value={instructions} onChange={(e) => setInstructions(e.target.value)} />
                                <textarea rows={4} type="text" placeholder='diagnosis' className='border-2 border-black py-2 px-2 my-1 rounded-lg ' value={diagnosis} onChange={(e) => setDiagnosis(e.target.value)} />
                            </div>
                            <button className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg" onClick={() => { handlePrescriptionDataOfflinePatientSubmit(patientDataForPrescription._id, patientDataForPrescription.doctorId) }}>Submit Prescription online</button>

                        </div>
                    </div>
                )}
                {patientDataForPrescription && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
                            <div className="flex justify-between items-center">
                                <h2 className="text-xl font-semibold">Appointment Details</h2>
                                <button className="text-red-500 text-lg" onClick={() => closeNewPrescriptionFormOfflinePatient()}>
                                    X
                                </button>
                            </div>
                            <div className="mt-4 text-black flex flex-col">
                                <input type="text" placeholder='Medications' className='border-2 border-black py-2 px-2 my-1 rounded-lg' value={medication} onChange={(e) => setMedication(e.target.value)} />
                                <input type="text" placeholder='instructions' className='border-2 border-black py-2 px-2 my-1 rounded-lg' value={instructions} onChange={(e) => setInstructions(e.target.value)} />
                                <textarea rows={4} type="text" placeholder='diagnosis' className='border-2 border-black py-2 px-2 my-1 rounded-lg ' value={diagnosis} onChange={(e) => setDiagnosis(e.target.value)} />
                            </div>
                            <button className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg" onClick={() => { handlePrescriptionDataSubmit(patientDataForPrescription.patientIdOfLogCred, patientDataForPrescription.appointmentId) }}>Submit Prescription offline</button>

                        </div>
                    </div>
                )}

                {openViewPrescription && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
                            <div className="flex justify-between items-center">
                                <h2 className="text-xl font-semibold text-black">View Prescription</h2>
                                <button className="text-red-500 text-lg" onClick={() => setOpenViewPrescription(false)}>
                                    X
                                </button>
                            </div>
                            <div className="mt-4 text-black flex flex-col">

                                <div className="mb-2"><strong>Medication:</strong> {singlePrescriptionData.medication}</div>
                                <div className="mb-2"><strong>Instruction:</strong> {singlePrescriptionData.instructions}</div>
                                <div className="mb-2"><strong>Diagnosis:</strong> {singlePrescriptionData.diagnosis}</div>
                                <div className="mb-2"><strong>Creation Date:</strong> {singlePrescriptionData.createdAt}</div>
                            </div>
                            {/* <button className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg" onClick={()=>{handlePrescriptionDataSubmit(patientDataForPrescription.patientIdOfLogCred, patientDataForPrescription.appointmentId)}}>Submit Prescription</button> */}

                        </div>
                    </div>
                )}
                {openViewPrescriptionOfflinePatient && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
                            <div className="flex justify-between items-center">
                                <h2 className="text-xl font-semibold text-black">View Prescription</h2>
                                <button className="text-red-500 text-lg" onClick={() => setOpenViewPrescriptionOfflinePatient(false)}>
                                    X
                                </button>
                            </div>
                            <div className="mt-4 text-black flex flex-col">

                                <div className="mb-2"><strong>Medication:</strong> {singlePrescriptionDataOfflinePatient.medication}</div>
                                <div className="mb-2"><strong>Instruction:</strong> {singlePrescriptionDataOfflinePatient.instructions}</div>
                                <div className="mb-2"><strong>Diagnosis:</strong> {singlePrescriptionDataOfflinePatient.diagnosis}</div>
                                <div className="mb-2"><strong>Creation Date:</strong> {singlePrescriptionDataOfflinePatient.createdAt}</div>
                            </div>
                            {/* <button className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg" onClick={()=>{handlePrescriptionDataSubmit(patientDataForPrescription.patientIdOfLogCred, patientDataForPrescription.appointmentId)}}>Submit Prescription</button> */}

                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PatientManagement;
