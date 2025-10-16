package com.example.demo.service;

import com.example.demo.model.BookedSeat;
import com.example.demo.model.Booking;
import com.openhtmltopdf.pdfboxout.PdfRendererBuilder;
import org.springframework.stereotype.Service;

import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.time.format.DateTimeFormatter;
import java.util.stream.Collectors;

@Service
public class PdfGeneratorService {

    public String generateBookingTicket(Booking booking) throws IOException {
        String pdfPath = "Ticket_" + booking.getId() + ".pdf";
        String htmlContent = createTicketHtml(booking);

        try (OutputStream os = new FileOutputStream(pdfPath)) {
            PdfRendererBuilder builder = new PdfRendererBuilder();
            builder.withHtmlContent(htmlContent, null);
            builder.toStream(os);
            builder.run();
        }

        return pdfPath;
    }

    private String createTicketHtml(Booking booking) {
        // Formatter for a more readable date and time
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm");
        String formattedBookingDate = booking.getBookingDate().format(formatter);

        // --- THIS IS THE CORRECTED LOGIC FOR HANDLING MULTIPLE SEATS ---
        String seatNumbers = booking.getSeats().stream()
                .map(BookedSeat::getSeatNumber)
                .collect(Collectors.joining(", "));
        // --- END OF CHANGE ---

        return "<html>" +
                "<head>" +
                "<style>" +
                "body { font-family: Arial, sans-serif; margin: 40px; }" +
                ".ticket { border: 2px solid #000; padding: 20px; border-radius: 10px; max-width: 600px; margin: auto; }" +
                ".header { text-align: center; border-bottom: 1px solid #ccc; padding-bottom: 10px; margin-bottom: 20px; }" +
                ".header h1 { margin: 0; color: #333; }" +
                ".details-table { width: 100%; border-collapse: collapse; }" +
                ".details-table td { padding: 8px; border-bottom: 1px solid #eee; }" +
                ".details-table td:first-child { font-weight: bold; color: #555; }" +
                "</style>" +
                "</head>" +
                "<body>" +
                "<div class='ticket'>" +
                "<div class='header'><h1>Railway Reservation Ticket</h1></div>" +
                "<table class='details-table'>" +
                "<tr><td>Booking ID:</td><td>" + booking.getId() + "</td></tr>" +
                "<tr><td>Passenger Name:</td><td>" + booking.getPassengerName() + "</td></tr>" +
                "<tr><td>Train Name:</td><td>" + booking.getTrain().getTrainName() + " (" + booking.getTrain().getTrainNumber() + ")</td></tr>" +
                "<tr><td>From:</td><td>" + booking.getTrain().getOrigin() + "</td></tr>" +
                "<tr><td>To:</td><td>" + booking.getTrain().getDestination() + "</td></tr>" +
                // Use the new seatNumbers string here
                "<tr><td>Seat Numbers:</td><td>" + seatNumbers + "</td></tr>" +
                "<tr><td>Booking Date:</td><td>" + formattedBookingDate + "</td></tr>" +
                "</table>" +
                "</div>" +
                "</body>" +
                "</html>";
    }
}