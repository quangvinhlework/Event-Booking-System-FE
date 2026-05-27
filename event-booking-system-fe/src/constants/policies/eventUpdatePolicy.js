import { EVENT_STATUS } from "../statuses/eventStatus";
export const EVENT_EDITABLE_FIELDS = {
    [EVENT_STATUS.DRAFT]: [
      "name",
      "description",
      "startTime",
      "endTime",
      "location",
      "totalTickets",
      "ticketPrice",
      "category",
      "newImages",
      "newVideos",
      "deletedMediaUrls"
    ],
  
    [EVENT_STATUS.ONSALE]: [
      "description",
      "name",
      "location",
      "category",
      "newImages",
      "newVideos",
      "deletedMediaUrls"
    ],
  
    [EVENT_STATUS.CANCELLED]: []
  };

export default EVENT_EDITABLE_FIELDS;