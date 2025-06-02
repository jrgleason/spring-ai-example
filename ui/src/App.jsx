import React, {useState} from 'react';
import ChatInterface from './components/ChatInterface.jsx';
import {DocumentGrid} from './components/DocumentGrid.jsx';
import {AddDocumentModal} from './components/AddDocumentModal.jsx';
import {StateProvider} from "./state/StateProvider.jsx";
import {AppBar, Box, Button, Tab, Tabs, Toolbar, Typography} from '@mui/material';
import {FileText, MessageSquare, Upload} from 'lucide-react';
import ThemeProvider from './ThemeProvider';

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
            {value === index && (                <Box className="p-3">
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
        <ThemeProvider>
            <StateProvider>
                <div className="min-h-screen bg-secondary-100">
                    <AppBar position="fixed">
                        <Toolbar>                            <Typography variant="h6" component="div" className="flex-grow">
                                Chat Interface
                            </Typography>
                        </Toolbar>
                    </AppBar>                    <div className="container mx-auto pt-16">
                        <Box className="w-full">
                            <Box className="border-b border-secondary-200">
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
                                    <div className="flex justify-end mb-4">                                        <Button
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
        </ThemeProvider>
    );
}

export default App;