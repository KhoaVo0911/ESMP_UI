import React, { useEffect, useState } from "react";
import "../Event/Event.css";
import { Tabs, Input, Button, Modal, Card, Row, Col } from 'antd';
import axios from 'axios';
import SearchIcon from '@mui/icons-material/Search';
import { Divider } from "@mui/material";

const URL = "https://668e540abf9912d4c92dcd67.mockapi.io/events";

const Event = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [events, setEvents] = useState([]);
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        axios.get(URL)
            .then(response => {
                setEvents(response.data);
                setFilteredEvents(response.data);
            })
            .catch(error => {
                console.error("There was an error fetching the events!", error);
            });
    }, []);

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleCreate = () => {
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const handleSearch = (e) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);
        const filtered = events.filter(event => event.eventName.toLowerCase().includes(term));
        setFilteredEvents(filtered);
    };

    const items = [
        { key: '1', label: 'On-going' },
        { key: '2', label: 'Running' },
        { key: '3', label: 'Cancelled' },
        { key: '4', label: 'All' },
        { key: '5', label: 'Trash' },
    ];

    return (
        <>
            <div className="header-container">
                <h1 className="headername"><b>Events</b></h1>
                <Button type="primary" className="create-event-button" onClick={showModal}>
                    + Create Event
                </Button>
            </div>
            <Tabs defaultActiveKey="1" items={items} />
            <Input
                placeholder="Search..."
                className="inputsearch"
                suffix={<SearchIcon />}
                value={searchTerm}
                onChange={handleSearch}
            />

            <Row gutter={[40, 20]} style={{ marginTop: '20px' }}>
                {filteredEvents.map(event => (
                    <Col key={event.id} xs={24} sm={12} md={8} lg={8}>
                        <Card
                            className="event-card"
                            hoverable
                            cover={
                                <div className="event-card-cover">
                                    <img alt={event.eventName} src={event.image} />
                                </div>
                            }
                        >
                            <div className="event-info-container">
                                <div className="event-date">
                                    <div className="event-date-box">
                                        <span className="event-date-day">{event.startDate.split(' ')[0]}</span>
                                        <span className="event-date-month">{event.startDate.split(' ')[1]}</span>
                                    </div>
                                </div>
                                <div className="event-details">
                                    <h3 className="event-title">{event.eventName}</h3>
                                    <p className="event-description">{event.description}</p>
                                </div>
                            </div>
                        </Card>
                    </Col>
                ))}
            </Row>




            <Modal
                title="Create Event"
                visible={isModalVisible}
                onCancel={handleCancel}
                footer={[
                    <Button key="create" type="primary" onClick={handleCreate}>
                        Create
                    </Button>,
                    <Button key="cancel" onClick={handleCancel}>
                        Cancel
                    </Button>,
                ]}
            >
                <Divider />
                <div>
                    <div>
                        <p>Event Name </p>
                        <Input required />
                    </div>

                    <div className="date" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div>
                            <p>Start date</p>
                            <Input type="date" required style={{ width: "150%" }} />
                        </div>
                        <div className="date-end">
                            <p>End date</p>
                            <Input type="date" required style={{ width: "150%" }} />
                        </div>
                    </div>

                    <div className="time" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div>
                            <p>Start time</p>
                            <Input type="time" required style={{ width: "186%" }} />
                        </div>
                        <div className="date-time">
                            <p>End time</p>
                            <Input type="time" required style={{ width: "184%" }} />
                        </div>
                    </div>

                    <div>
                        <p>Event Description</p>
                        <Input.TextArea placeholder="Please mention here" />
                    </div>
                    <div>
                        <p>Event Thumbnail</p>
                    </div>
                </div>
            </Modal>
        </>
    );
}

export default Event;
