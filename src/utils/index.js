import moment from 'moment';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export const TokenInvalid = () => {
  const navigate = useNavigate();
  navigate('/login');
  toast.error("Your session has expired. Please log in again.");
}

export const timeAgo = (createdAt) => {
    const now = moment();
    const postTime = moment(createdAt);
    const duration = moment.duration(now.diff(postTime));
  
    const years = duration.years();
    const months = duration.months();
    const days = duration.days();
    const hours = duration.hours();
    const minutes = duration.minutes();
  
    if (years > 0) {
      return `${years} years ago`;
    } else if (months > 0) {
      return `${months} months ago`;
    } else if (days > 0) {
      return `${days} days ago`;
    } else if (hours > 0) {
      return `${hours} hours ago`;
    } else if (minutes > 1) {
      return `${minutes} minutes ago`;
    } else {
      return `Just now`
    }
};

export function formatToMonthYear(isoString) {
  const date = new Date(isoString);
  const options = { year: 'numeric', month: 'long' }; // Tùy chọn hiển thị tháng và năm
  return date.toLocaleDateString('en-US', options);
}

export const timeAgoShort = (createdAt) => {
  const now = moment();
  const postTime = moment(createdAt);
  const duration = moment.duration(now.diff(postTime));

  const years = duration.years();
  const months = duration.months();
  const days = duration.days();
  const hours = duration.hours();
  const minutes = duration.minutes();

  if (years > 0) {
    return `${years}y`;
  } else if (months > 0) {
    return `${months}mon`;
  } else if (days > 0) {
    return `${days}d`;
  } else if (hours > 0) {
    return `${hours}h`;
  } else if(minutes >= 1) {
    return `${minutes}m`;
  } else {
    return `now`
  }
};

export const convertNewlinesToBreaks = (text) => {
    return text.split('\n').map((str, index) => (
        <React.Fragment key={index}>
            {str}
            <br />
        </React.Fragment>
    ));
};

