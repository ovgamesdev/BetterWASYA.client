import React from "react";

import { useParams } from "react-router-dom";

import Follow from "../../components/UI/AlertBox/Follow";
import useTitle from "../../hooks/useTitle/index.tsx";
import useWebSocket from "./websocket";

import { toast, ToastContainer, cssTransition } from "react-toastify";
import Sub from "../../components/UI/AlertBox/Sub";
import Raid from "../../components/UI/AlertBox/Raid";

import "./animate.css";

const AlertBox = () => {
  useTitle("BetterWASYA | AlertBox");
  const { token } = useParams();

  const newEvent = async ({ event, payload }) => {
    switch (event) {
      case "NEW_FOLLOWER":
        toast(<Follow info={payload} />, {
          autoClose: payload.follow_alert_duration,
          transition: cssTransition({
            enter: "animated " + payload.follow_show_animation,
            exit: "animated " + payload.follow_hide_animation,
          }),
        });
        break;
      case "SUBSCRIBE":
        toast(<Sub info={payload} />, {
          autoClose: payload.sub_alert_duration,
          transition: cssTransition({
            enter: "animated " + payload.sub_show_animation,
            exit: "animated " + payload.sub_hide_animation,
          }),
        });
        break;
      case "RAID":
        toast(<Raid info={payload} />, {
          autoClose: payload.raid_alert_duration,
          transition: cssTransition({
            enter: "animated " + payload.raid_show_animation,
            exit: "animated " + payload.raid_hide_animation,
          }),
        });
        break;
      default:
        console.log("undefined event:", event);
        break;
    }

    console.log(payload);
  };

  useWebSocket(token, newEvent);

  return (
    <ToastContainer
      style={{}}
      // hideProgressBar={true}
      closeOnClick={false}
      pauseOnHover={false}
      pauseOnFocusLoss={false}
      closeButton={false}
      rtl={false}
      draggable={false}
      limit={1}
    />
  );
};

export default AlertBox;
