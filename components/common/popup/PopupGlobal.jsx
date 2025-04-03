import { AnimatePresence, motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import Popup from "reactjs-popup";

const PopupGlobal = ({ ...props }) => {
  const dispatch = useDispatch();

  const statePopupGlobal = useSelector((state) => state.statePopupGlobal);

  const handleClose = () => {
    dispatch({
      type: "statePopupGlobal",
      payload: { open: false },
    });
  };

  return (
    <AnimatePresence mode="wait">
      <Popup
        modal
        open={statePopupGlobal.open}
        closeOnDocumentClick
        onClose={handleClose}
        // contentStyle={{ borderRadius: '8px', width: '350px', padding: '20px' }}
        className={`${props.className} border-gradient`}
        overlayStyle={{
          background: "#25387A40",
          zIndex: 1000,
          backdropFilter: "blur(1.5px)", // Hiệu ứng blur cho nền overlay
          WebkitBackdropFilter: "blur(1.5px)", // Hỗ trợ cho trình duyệt Webkit (Safari)
        }}
      >
        <motion.div
          key="popup-content"
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 30 }}
          transition={{ duration: 0.03, ease: "linear" }}
          className=" border-gradient"
        >
          {statePopupGlobal.children}
        </motion.div>
      </Popup>
    </AnimatePresence>
  );
};

export default PopupGlobal;
