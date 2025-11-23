import React, { useEffect, useState } from "react";
import moment from 'moment-timezone';

const BidTimer = ({ start, end }) => {
    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const [timeLeft, setTimeLeft] = useState("");

    useEffect(() => {
        const startDate = moment.tz(start, userTimeZone);
        let endDate = moment.tz(end, userTimeZone);
        const now = moment.tz(userTimeZone);

        const timer = setInterval(() => {
            const now = moment.tz(userTimeZone);

            if (endDate.isBefore(now)) {
                setTimeLeft("Expired");
                clearInterval(timer);
                return;
            }

            let difference;
            let formattedTime;

            if (startDate.isAfter(now)) {
                difference = startDate.diff(now);
                formattedTime = formatTime(difference);
                setTimeLeft("Starts in " + formattedTime);
            } else {
                difference = endDate.diff(now);
                formattedTime = formatTime(difference);
                setTimeLeft("" + formattedTime);
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [start, end, userTimeZone]);

    const formatTime = (time) => {
        const duration = moment.duration(time);
        const days = Math.floor(duration.asDays());
        const hours = duration.hours();
        const minutes = duration.minutes();
        const seconds = duration.seconds();

        let formattedTime = "";

        if (days > 0) {
            formattedTime += days + "d, ";
        }
        formattedTime += ("0" + hours).slice(-2) + ":";
        formattedTime += ("0" + minutes).slice(-2) + ":";
        formattedTime += ("0" + seconds).slice(-2);

        return formattedTime;
    };

    return (
        <span>
            {timeLeft ? timeLeft : '00:00:00'}
        </span>
    )
};

export default BidTimer;
