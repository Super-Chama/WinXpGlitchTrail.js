import React from "react";
import ReactDOM from "react-dom";
import Draggable from "react-draggable";
import "xp.css/dist/XP.css";
import errorLogo from "../public/Error3.png";

const DummyWindow = ({
  style,
  className,
  onMouseDown,
  onMouseUp,
  onTouchStart,
  onTouchEnd
}) => {
  return (
    <div
      style={style}
      className={className}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div className="title-bar">
        <div className="title-bar-text unselectable">Fatal Error</div>
        <div className="title-bar-controls">
          <button aria-label="Close" />
        </div>
      </div>

      <div className="window-body">
        <span style={{ justifyContent: "center", display: "flex" }}>
          <img className="unselectable" src={errorLogo} alt="Logo" />
          <p className="unselectable" style={{ marginLeft: "10px" }}>
            Failed to load someodd.dll
          </p>
        </span>
        <div
          className="field-row"
          style={{ justifyContent: "center", marginTop: "20px" }}
        >
          <button className="unselectable">Ok</button>
        </div>
      </div>
    </div>
  );
};

const DraggableWindow = (props) => {
  const [dragState, setDragState] = React.useState({
    deltaPosition: {
      x: 0,
      y: 0
    }
  });

  const handleDrag = (e, ui) => {
    const { x, y } = dragState.deltaPosition;
    props.onDragWindow(x + ui.deltaX, y + ui.deltaY);
    setDragState({
      deltaPosition: {
        x: x + ui.deltaX,
        y: y + ui.deltaY
      }
    });
  };

  const activate = () => {};

  const deactivate = () => {
    props.onStopDrag();
  };

  return (
    <Draggable
      axis="both"
      handle=".title-bar"
      defaultPosition={{ x: 0, y: 0 }}
      bounds=".bwindow"
      position={null}
      scale={1}
      onStart={() => activate()}
      onDrag={(e, ui) => handleDrag(e, ui)}
      onStop={() => deactivate()}
    >
      <DummyWindow
        className="window"
        style={{ width: 225, position: "absolute", zIndex: 999 }}
      />
    </Draggable>
  );
};

const App = () => {
  const [dummyWindowsArray, setdummyWindowsArray] = React.useState([
    { x: 0, y: 0, i: 1 }
  ]);

  const moveIt = (x, y) => {
    let lastWindow = dummyWindowsArray[dummyWindowsArray.length - 1];
    setdummyWindowsArray([
      ...dummyWindowsArray,
      { x: x + 5, y: y + 5, i: lastWindow ? lastWindow.i + 1 : 1 }
    ]);
    cleanUp(200);
  };

  const cleanUp = (length) => {
    if (dummyWindowsArray.length > length) {
      let reducedArr = dummyWindowsArray;
      reducedArr.shift();
      setdummyWindowsArray([...reducedArr]);
    }
  };

  const clearTrial = () => {
    let timer = setInterval(() => {
      cleanUp(0);
      if (dummyWindowsArray.length === 0) {
        clearInterval(timer);
      }
    }, 60);
  };

  return (
    <div>
      <DraggableWindow
        onDragWindow={(x, y) => moveIt(x, y)}
        onStopDrag={() => clearTrial()}
      />
      {dummyWindowsArray.map((element, i) => {
        return (
          <DummyWindow
            key={i}
            className="window"
            style={{
              width: 225,
              position: "absolute",
              zIndex: i,
              transform: `translateX(${element.x}px) translateY(${element.y}px)`
            }}
          />
        );
      })}
    </div>
  );
};

const rootElement = document.getElementById("root");
ReactDOM.render(
  <div>
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}
      className="bwindow"
    >
      <div style={{ width: 350 }}>
        <App />
      </div>
    </div>
  </div>,
  rootElement
);
