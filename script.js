//Initialize Audio Context
window.AudioContext = window.AudioContext || window.webkitAudioContext;

//Dimensions of Grid in Pixels
const GRID_X_LENGTH_IN_PX = 1000;
const GRID_Y_LENGTH_IN_PX = 1000;

//Dimensions of Grid in Cells
const GRID_X_LENGTH_IN_CELLS = 20;
const GRID_Y_LENGTH_IN_CELLS = 12;

//Dimensions of Cell in Pixels
const CELL_X_LENGTH_IN_PX = GRID_X_LENGTH_IN_PX / GRID_X_LENGTH_IN_CELLS;
const CELL_Y_LENGTH_IN_PX = GRID_Y_LENGTH_IN_PX / GRID_Y_LENGTH_IN_CELLS;

const BEATS_PER_MINUTE = 100


class Component {
  constructor(gridXPos, gridYPos) {
    this.gridXPos = gridXPos;
    this.gridYPos = gridYPos;
  }

  get GridXPos() {
    return this.gridXPos;
  }

  set GridXPos(value) {
    this.gridXPos = value;
  }

  get GridYPos() {
    return this.gridYPos;
  }

  set GridYPos(value) {
    this.gridYPos = value;
  }

  get PixelXPos() {
    if (this.gridXPos) {
      this.gridXPos * CELL_X_LENGTH_PX;
    } else {
      throw "Object:" + this + " - Cannot return X position in pixels without setting grid position";
    }
  }

  get PixelYPos() {
    if (this.gridYPos) {
      this.gridXPos * CELL_X_LENGTH_PX;
    } else {
      throw "Object:" + this + " - Cannot return Y position in pixels without setting grid position";
    }
  }
}


class Clock extends Component {
  //NOTE: The term "Duration" is used to represent the duration in beats before
  //      the clock switches the state of the current.
  //      (EX: A clock with a duration of 2 will switch states every 2 beats)
  constructor(gridXPos, gridYPos, outputNode, duration) {
    super(gridXPos, gridYPos);
    this.outputNode = outputNode;
    this.duration = duration;
  }
}


class Switch extends Component {
  constructor(gridXPos, gridYPos, outputNode, isActive) {
    super(gridXPos, gridYPos);
    this.outputNode = outputNode;
    this.isActive = isActive;
  }

  flip() {
    if (this.isActive === false) {
      this.isActive === true;
    } else {
      this.isActive === false;
    }
  }
}


class LogicGate extends Component {
  constructor(gridXpos, gridYpos, inputNodeA, inputNodeB, outputNode) {
    super(gridXPos, gridYPos);
    this.inputNodeA = inputNodeA;
    this.inputNodeB = inputNodeB;
    this.outputNode = outputNode;
  }

  get InputNodeA() {
    return this.inputNodeA;
  }

  set InputNodeA(value) {
    this.inputNodeA = value;
  }

  get InputNodeB() {
    return this.inputNodeB;
  }

  set InputNodeB(value) {
    this.inputNodeB = value;
  }

  get OutputNode() {
    return this.outputNode;
  }

  set OutputNode(value) {
    this.outputNode = value;
  }

  get isFullyConnected() {
    return (this.outputNode !== null &&
            this.inputNodeA !== null &&
            this.inputNodeB !== null)
  }

  get isActive() {
    if (this.isFullyConnected) {
      return this.isActivatable
    } else {
      return false;
    }
  }
}


class ANDGate extends LogicGate {
  constructor(gridXPos, gridYPos, inputNodeA, inputNodeB, outputNode) {
    super(gridXPos, gridYPos, inputNodeA, inputNodeB, outputNode);
  }

  get isActivatable() {
    return (this.inputNodeA.isActivatable() && this.inputNodeB.isActivatable())
  }
}


class ORGate extends LogicGate {
  constructor(gridXPos, gridYPos, inputNodeA, inputNodeB, outputNode) {
    super(gridXPos, gridYPos, inputNodeA, inputNodeB, outputNode);
  }


  get isActivatable() {
    return (this.inputNodeA.isActivatable() || this.inputNodeB.isActivatable())
  }
}


class XORGate extends LogicGate {
  constructor(gridXPos, gridYPos, inputNodeA, inputNodeB, outputNode) {
    super(gridXPos, gridYPos, inputNodeA, inputNodeB, outputNode);
  }


  get isActivatable() {
    if (inputNodeA.isActivatable() && inputNodeB.isActivatable()) {
      return false;
    } else if (inputNodeA.isActivatable() || inputNodeB.isActivatable()) {
      return true;
    } else {
      return false;
    }
  }
}


class NANDGate extends LogicGate {
  constructor(gridXPos, gridYPos, inputNodeA, inputNodeB, outputNode) {
    super(gridXPos, gridYPos, inputNodeA, inputNodeB, outputNode);
  }


  get isActivatable() {
    if (inputNodeA.isActivatable() && inputNodeB.isActivatable()) {
      return false;
    } else {
      return true;
    }
  }
}


class NORGate extends LogicGate {
  constructor(gridXPos, gridYPos, inputNodeA, inputNodeB, outputNode) {
    super(gridXPos, gridYPos, inputNodeA, inputNodeB, outputNode);
  }

  get isActivatable() {
    return (!(inputNodeA.isActivatable() || inputNodeB.isActivatable()))
  }
}


class XNORGate extends LogicGate {
  constructor(gridXPos, gridYPos, inputNodeA, inputNodeB, outputNode) {
    super(gridXPos, gridYPos, inputNodeA, inputNodeB, outputNode);
  }

  get isActivatable() {
    if (inputNodeA.isActivatable() && inputNodeB.isActivatable()) {
      return true;
    } else if (inputNodeA.isActivatable() || inputNodeB.isActivatable()) {
      return false;
    } else {
      return true;
    }
  }
}


class Tone {
    constructor(gridYPos) {
        this.gridYPos = gridYPos;
    }

    get GridYPos() {
      return this.gridYPos;
    }

    get frequency() {
      return 440 * Math.pow(2, (this.gridYPos / 12));
    }
}


class Player {

    //NOTE: A maximum of 6 Audio Contexts can be active at one time. Playing
    //      more than one tone per audio context results in overlapping waveforms.
    //      This means that only 6 notes will be able to play at any given time
    //      and the program should run a check to confirm that the user doesn't
    //      have more than 6 logic gates in one column of the grid. Also, the duration of
    //      the of the existence of each audio context should be slightly shorter than the
    //      BPM of the audio player to prevent overlap.

    static playTone(tone) {
        var ctx = new AudioContext();
        var t = ctx.currentTime;
        var osc = ctx.createOscillator();
        var duration = 200;
        osc.type = "sine"
        osc.frequency.value = tone.frequency();
        osc.start(t);
        osc.stop(t + duration);
        osc.connect(ctx.destination);
    }
}

var gate = new LogicGate(100, 100, 100, 100, 100)
