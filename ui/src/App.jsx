import React, {useState} from 'react';
import ChatInterface from './components/ChatInterface.jsx';
import {DocumentGrid} from './components/DocumentGrid.jsx';
import {AddDocumentModal} from './components/AddDocumentModal.jsx';
import {StateProvider} from "./state/StateProvider.jsx";
import {Box, Button, Tab, Tabs} from '@mui/material';
import {FileText, MessageSquare, Upload} from 'lucide-react';

function TabPanel(props) {
    const {children, value, index, ...other} = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{p: 3}}>
                    {children}
                </Box>
            )}
        </div>
    );
}

function App() {
    const [isAddDocumentOpen, setIsAddDocumentOpen] = useState(false);
    const [tabValue, setTabValue] = useState(0);

    const handleChange = (event, newValue) => {
        setTabValue(newValue);
    };

    return (
        <StateProvider>
            <div className="min-h-screen bg-gray-100 py-8">
                <div className="container mx-auto">
                    <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
                        Chat Interface
                    </h1>

                    <Box sx={{width: '100%'}}>
                        <Box sx={{borderBottom: 1, borderColor: 'divider'}}>
                            <Tabs
                                value={tabValue}
                                onChange={handleChange}
                                centered
                                aria-label="chat and documents tabs"
                            >
                                <Tab
                                    icon={<MessageSquare className="w-4 h-4"/>}
                                    label="Chat"
                                    iconPosition="start"
                                />
                                <Tab
                                    icon={<FileText className="w-4 h-4"/>}
                                    label="Documents"
                                    iconPosition="start"
                                />
                            </Tabs>
                        </Box>

                        <TabPanel value={tabValue} index={0}>
                            <ChatInterface/>
                        </TabPanel>

                        <TabPanel value={tabValue} index={1}>
                            <div className="space-y-4">
                                <div className="flex justify-end mb-4">
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        startIcon={<Upload className="w-4 h-4"/>}
                                        onClick={() => setIsAddDocumentOpen(true)}
                                    >
                                        Upload Document
                                    </Button>
                                </div>
                                <DocumentGrid/>
                                <AddDocumentModal
                                    isOpen={isAddDocumentOpen}
                                    onClose={() => setIsAddDocumentOpen(false)}
                                />
                            </div>
                        </TabPanel>
                    </Box>
                </div>
            </div>
        </StateProvider>
    );
}

export default App;