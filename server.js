



const express=require('express');


const app=express();

app.use(express.json());

// 1 Endpoint for Creating Room
let rooms = [];
let bookings = [];
app.post('/room',(request,response)=>{

    const { roomName, availableSeats, amenities, pricefor1hour } = request.body;
    console.log(request.body);
    let room = {
        id: rooms.length + 1,
        roomName,
        availableSeats,
        amenities,
        pricefor1hour
    };
    rooms.push(room);
    response.status(201).json(room)
    
})



// 2 Endpoint for booking a room
app.post('/bookings', (request,response) => {
    const { customerName, date, startTime, endTime, roomId } = request.body;
    const room = rooms.find(room => room.id === roomId);
    if (!room) {
        return response.status(404).json({ message: 'Room not found' });
    }
    const booking = {
        id: bookings.length + 1,
        customerName,
        date,
        startTime,
        endTime,
        roomId
    };
    bookings.push(booking);
    response.status(201).json(booking);
});


// Endpoint for listing all rooms with booked data

app.get('/rooms/booked', (request, response) => {
    const bookedRooms = rooms.map(room => {
        const bookingsForRoom = bookings.filter(booking => booking.roomId === room.id);
        return {
            roomName: room.roomName,
            bookedStatus: bookingsForRoom.length > 0 ? 'Booked' : 'Available',
            bookings: bookingsForRoom
        };
    });
    response.status(201).json(bookedRooms);
});

// Endpoint for listing all customers with booked data
app.get('/customers/bookings', (request, response) => {
    const customerBookings = [];
    bookings.forEach(booking => {
        const room = rooms.find(room => room.id === booking.roomId);
        customerBookings.push({
            customerName: booking.customerName,
            roomName: room.roomName,
            date: booking.date,
            startTime: booking.startTime,
            endTime: booking.endTime
        });
    });
    response.status(201).json(customerBookings);
});


// Endpoint for listing how many times a customer has booked the room

app.get('/customers/:customerName/bookings', (requeste, response) => {
    const { customerName } = requeste.params;
    const customerBookings = bookings.filter(booking => booking.customerName === customerName);
    response.status(201).json(customerBookings);
});




// Hostname and Port no

const Hostname='127.0.0.1';

    const Port=3000;

    app.listen(Port,()=>{
        console.log(`Server running at http://${Hostname}:${Port}`);
    })

