const http = require('http');
const Server = require('socket.io').Server;
const Voicemeeter = require('voicemeeter-connector').Voicemeeter;

let port = 8099;
const data = {
  connected: false,
  type: '',
  version: '',
  inputDevices: [],
  outputDevices: [],
  bus: [],
  strip: [],
  recorder: {},
}
let connection = false;
let levelsInterval = null;

process.argv.forEach((arg, index) => {
  if (arg.toLowerCase() === '-p' || arg.toLowerCase() === '--port') {
    let customPort = process.argv[index + 1]

    if (customPort) {
      customPort = parseInt(customPort)
      if (!isNaN(customPort)) port = customPort
    }
  }
})

console.log(`Starting Voicemeeter Proxy on port: ${port}`)

const httpServer = http.createServer();
const io = new Server(httpServer, {});

const parseVersion = (raw) => {
  let version = parseInt(parseInt(raw.toString()).toString(16))
  let major = Math.floor(version / 1000000) % 100
  let minor = Math.floor(version / 10000) % 100
  let patch = Math.floor(version / 100) % 100
  let increment = version % 100

  if (isNaN(major) || isNaN(minor) || isNaN(patch) || isNaN(increment)) {
    return ''
  } else {
    return `${major}.${minor}.${patch}.${increment}`
  }
};

const getAllData = () => {
  if (!data.connected || !connection) return

  const busName = {
    voicemeeter: ['A1', 'A2'],
    voicemeeterBanana: ['A1', 'A2', 'A3', 'B1', 'B2'],
    voicemeeterPotato: ['A1', 'A2', 'A3', 'A4', 'A5', 'B1', 'B2', 'B3'],
    '': []
  };

  const maxBus = {
    voicemeeter: 2,
    voicemeeterBanana: 5,
    voicemeeterPotato: 8,
    '': 0
  };

  const maxStrip = {
    voicemeeter: 3,
    voicemeeterBanana: 5,
    voicemeeterPotato: 8,
    '': 0
  };

  const phsyicalInputs = {
    voicemeeter: 2,
    voicemeeterBanana: 3,
    voicemeeterPotato: 5,
    '': 0
  };

  const phsicalOutputs = {
    voicemeeter: 2,
    voicemeeterBanana: 3,
    voicemeeterPotato: 5,
    '': 0
  };

  for (let i = 0; i < maxBus[data.type]; i++) {
    let mode = 'normal'

    const modes = [
      ['normal', connection?.getBusParameter(i, 'mode.normal')],
      ['Amix', connection?.getBusParameter(i, 'mode.Amix')],
      ['Bmix', connection?.getBusParameter(i, 'mode.Bmix')],
      ['Repeat', connection?.getBusParameter(i, 'mode.Reapt')],
      ['Composite', connection?.getBusParameter(i, 'mode.Composite')],
      ['TVMix', connection?.getBusParameter(i, 'mode.TVMix')],
      ['UpMix21', connection?.getBusParameter(i, 'mode.UpMix21')],
      ['UpMix41', connection?.getBusParameter(i, 'mode.UpMix41')],
      ['UpMix61', connection?.getBusParameter(i, 'mode.UpMix61')],
      ['CenterOnly', connection?.getBusParameter(i, 'mode.CenterOnly')],
      ['LFEOnly', connection?.getBusParameter(i, 'mode.LFEOnly')],
      ['RearOnly', connection?.getBusParameter(i, 'mode.RearOnly')]
    ]

    modes.forEach(type => {
      if (type[1] === 1) mode = type[0]
    })

    data.bus[i] = {
      index: i,
      type: i < phsicalOutputs[data.type] ? 'physical' : 'virtual',
      mono: !!connection?.getBusParameter(i, 'Mono'),
      mute: !!connection?.getBusParameter(i, 'Mute'),
      eq: !!connection?.getBusParameter(i, 'EQ.on'),
      eqAB: !!connection?.getBusParameter(i, 'EQ.AB'),
      gain: connection?.getBusParameter(i, 'Gain'),
      label: connection?.getBusParameter(i, 'Label'),
      mode,
      sel: !!connection?.getBusParameter(i, 'Sel'),
      returnReverb: connection?.getBusParameter(i, 'ReturnReverb'),
      returnDelay: connection?.getBusParameter(i, 'ReturnDelay'),
      returnFx1: connection?.getBusParameter(i, 'ReturnFx1'),
      returnFx2: connection?.getBusParameter(i, 'ReturnFx2'),
      monitor: connection?.getBusParameter(i, 'Monitor'),
      levels: data.bus[i]?.levels || []
    }
  }

  for (let i = 0; i < maxStrip[data.type]; i++) {
    data.strip[i] = {
      index: i,
      type: i < phsyicalInputs[data.type] ? 'physical' : 'virtual',
      mono: connection?.getStripParameter(i, 'Mono'),
      mute: connection?.getStripParameter(i, 'Mute'),
      solo: connection?.getStripParameter(i, 'Solo'),
      mc: connection?.getStripParameter(i, 'MC'),
      gain: connection?.getStripParameter(i, 'Gain'),
      gainLayer: [
        connection?.getStripParameter(i, 'GainLayer[0]'),
        connection?.getStripParameter(i, 'GainLayer[1]'),
        connection?.getStripParameter(i, 'GainLayer[2]'),
        connection?.getStripParameter(i, 'GainLayer[3]'),
        connection?.getStripParameter(i, 'GainLayer[4]'),
        connection?.getStripParameter(i, 'GainLayer[5]'),
        connection?.getStripParameter(i, 'GainLayer[6]'),
        connection?.getStripParameter(i, 'GainLayer[7]'),
      ],
      panX: connection?.getStripParameter(i, 'Pan_x'),
      panY: connection?.getStripParameter(i, 'Pan_y'),
      colorX: connection?.getStripParameter(i, 'Color_x'),
      colorY: connection?.getStripParameter(i, 'Color_y'),
      fxX: connection?.getStripParameter(i, 'fx_x'),
      fxY: connection?.getStripParameter(i, 'fx_y'),
      comp: connection?.getStripParameter(i, 'Comp'),
      compGainIn: connection?.getStripParameter(i, 'Comp.GainIn'),
      compRatio: connection?.getStripParameter(i, 'Comp.Ratio'),
      compThreshold: connection?.getStripParameter(i, 'Comp.Threshold'),
      compAttack: connection?.getStripParameter(i, 'Comp.Attack'),
      compRelease: connection?.getStripParameter(i, 'Comp.Release'),
      compKnee: connection?.getStripParameter(i, 'Comp.Knee'),
      compGainOut: connection?.getStripParameter(i, 'Comp.GainOut'),
      compMakeUp: connection?.getStripParameter(i, 'Comp.MakeUp'),
      gate: connection?.getStripParameter(i, 'Gate'),
      gateThreshold: connection?.getStripParameter(i, 'Gate.Threshold'),
      gateDamping: connection?.getStripParameter(i, 'Gate.Damping'),
      gateBPSidechain: connection?.getStripParameter(i, 'Gate.BPSidechain'),
      gateAttack: connection?.getStripParameter(i, 'Gate.Attack'),
      gateHold: connection?.getStripParameter(i, 'Gate.Hold'),
      gateRelease: connection?.getStripParameter(i, 'Gate.Release'),
      denoiser: connection?.getStripParameter(i, 'Denoiser'),
      karaoke: connection?.getStripParameter(i, 'Karaoke'),
      limit: connection?.getStripParameter(i, 'Limit'),
      eqGain1: connection?.getStripParameter(i, 'EqGain1'),
      eqGain2: connection?.getStripParameter(i, 'EqGain2'),
      eqGain3: connection?.getStripParameter(i, 'EqGain3'),
      label: connection?.getStripParameter(i, 'Label'),
      A1: connection?.getStripParameter(i, 'A1'),
      A2: connection?.getStripParameter(i, 'A2'),
      A3: connection?.getStripParameter(i, 'A3'),
      A4: connection?.getStripParameter(i, 'A4'),
      A5: connection?.getStripParameter(i, 'A5'),
      B1: connection?.getStripParameter(i, 'B1'),
      B2: connection?.getStripParameter(i, 'B2'),
      B3: connection?.getStripParameter(i, 'B3'),
      reverb: connection?.getStripParameter(i, 'Reverb'),
      delay: connection?.getStripParameter(i, 'Delay'),
      fx1: connection?.getStripParameter(i, 'Fx1'),
      fx2: connection?.getStripParameter(i, 'Fx2'),
      postReverb: connection?.getStripParameter(i, 'PostReverb'),
      postDelay: connection?.getStripParameter(i, 'PostDelay'),
      postFx1: connection?.getStripParameter(i, 'PostFx1'),
      postFx2: connection?.getStripParameter(i, 'PostFx2'),
      eqon: connection?.getStripParameter(i, 'EQ.on'),
      eqAB: connection?.getStripParameter(i, 'EQ.AB'),
      levels: data.strip[i]?.levels || []
    }
  }

  data.recorder = {
    stop: connection?.getRecorderParameter('stop'),
    play: connection?.getRecorderParameter('play'),
    replay: connection?.getRecorderParameter('replay'),
    fastForward: connection?.getRecorderParameter('ff'),
    rewind: connection?.getRecorderParameter('req'),
    goTo: connection?.getRecorderParameter('goto'),
    A1: connection?.getRecorderParameter('A1'),
    A2: connection?.getRecorderParameter('A2'),
    A3: connection?.getRecorderParameter('A3'),
    A4: connection?.getRecorderParameter('A4'),
    A5: connection?.getRecorderParameter('A5'),
    B1: connection?.getRecorderParameter('B1'),
    B2: connection?.getRecorderParameter('B2'),
    B3: connection?.getRecorderParameter('B3'),
    record: connection?.getRecorderParameter('record'),
    pause: connection?.getRecorderParameter('pause'),
    load: connection?.getRecorderParameter('load'),
    ArmStrip0: connection?.getRecorderParameter('ArmStrip(0)'),
    ArmStrip1: connection?.getRecorderParameter('ArmStrip(1)'),
    ArmStrip2: connection?.getRecorderParameter('ArmStrip(2)'),
    ArmStrip3: connection?.getRecorderParameter('ArmStrip(3)'),
    ArmStrip4: connection?.getRecorderParameter('ArmStrip(4)'),
    ArmStrip5: connection?.getRecorderParameter('ArmStrip(5)'),
    ArmStrip6: connection?.getRecorderParameter('ArmStrip(6)'),
    ArmStrip7: connection?.getRecorderParameter('ArmStrip(7)'),
    ArmStrip8: connection?.getRecorderParameter('ArmStrip(8)'),
    ArmBus0: connection?.getRecorderParameter('ArmBus(0)'),
    ArmBus1: connection?.getRecorderParameter('ArmBus(1)'),
    ArmBus2: connection?.getRecorderParameter('ArmBus(2)'),
    ArmBus3: connection?.getRecorderParameter('ArmBus(3)'),
    ArmBus4: connection?.getRecorderParameter('ArmBus(4)'),
    ArmBus5: connection?.getRecorderParameter('ArmBus(5)'),
    ArmBus6: connection?.getRecorderParameter('ArmBus(6)'),
    ArmBus7: connection?.getRecorderParameter('ArmBus(7)'),
    ArmBus8: connection?.getRecorderParameter('ArmBus(8)'),
    modeRecBus: connection?.getRecorderParameter('mode.recbus'),
    modePlayOnLoad: connection?.getRecorderParameter('mode.PlayOnLoad'),
    modeLoop: connection?.getRecorderParameter('mode.Loop'),
    modeMultiTrack: connection?.getRecorderParameter('mode.MultiTrack'),
    bitResolution: connection?.getRecorderParameter('BitResolution'),
    channel: connection?.getRecorderParameter('Channel'),
    kbps: connection?.getRecorderParameter('kbps'),
    fileType: connection?.getRecorderParameter('FileType'),
    gain: connection?.getRecorderParameter('Gain'),
  }
};

const getLevels = () => {
  if (!data.connected || !connection) return

  data.strip.forEach(strip => {
    strip.levels[0] = connection.getLevel(1, strip.index * 2)
    strip.levels[1] = connection.getLevel(1, strip.index * 2 + 1)
  })

  data.bus.forEach(bus => {
    bus.levels[0] = connection.getLevel(3, bus.index * 8)
    bus.levels[1] = connection.getLevel(3, bus.index * 8 + 1)
  })
};

const init = () => {
  Voicemeeter.init()
    .then(vm => {
      vm.connect()
      data.connected = true
      connection = vm
      console.log('Connected to Voicemeeter')

      vm.attachChangeEvent(() => {
        vm.updateDeviceList()
        data.inputDevices = vm.$inputDevices;
        data.outputDevices = vm.$outputDevices;
        data.type = vm.$type;
        data.version = parseVersion(vm.$version)

        getAllData()
        io.emit('data', data)
        io.emit('change')
      })

      levelsInterval = setInterval(() => {
        getLevels()
        io.emit('data', data)
      }, 100)

    })
    .catch(err => {
      console.error('error', err.toString())
    })
};

io.on('connection', socket => {
  console.log('Socket Connected!')
  getAllData()
  io.emit('data', data)
  io.emit('change')

  socket.on('getBusParameter', ({ index, property }) => {
    const value = connection?.getBusParameter(index, property);
    socket.emit('getBusParameter', { index, property, value });
  });

  socket.on('getLevels', ({ type, id }) => {
    const value = connection?.getLevels(type, id);
    socket.emit('getLevels', { type, id, value });
  });

  socket.on('getRecorderParameter', ({ property }) => {
    const value = connection?.getRecorderParameter(property);
    socket.emit('getRecorderParameter', { property, value });
  });

  socket.on('getStripParameter', ({ index, property }) => {
    const value = connection?.getStripParameter(index, property)
    socket.emit('getStripParameter', { index, property, value });
  });

  socket.on('setBusParameter', ({ index, property, value }) => {
    connection?.setBusParameter(index, property, value);
  });

  socket.on('setRecorderParameter', ({ property, value }) => {
    connection?.setRecorderParameter(property, value);
  });

  socket.on('setStripParameter', ({ index, property, value }) => {
    connection?.setStripParameter(index, property, value);
  });

  socket.on('disconnect', () => {
    console.log('Socket Disconnected!')
  });

});


httpServer.listen(port);


// Hnadle warning and shutdown if port is in use.
process.on('uncaughtException', err => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${port} already in use, please use -p or --port argument to specify a different port`);
  } else {
    console.log(err)
  }

  process.exit(1);
});

init();
