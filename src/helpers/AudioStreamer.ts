class AudioStreamer {
  context: AudioStreamer;
  dataHandler: (buffer: ArrayBuffer) => void;
  errorHandler: (error: any) => any;
  source: MediaStreamAudioSourceNode;
  processor: ScriptProcessorNode;
  buffer: ArrayBuffer;
  globalStream: MediaStream;

  constructor(
    dataHandler: (buffer: ArrayBuffer) => void,
    errorHandler: (e: any) => any
  ) {
    this.dataHandler = dataHandler;
    this.errorHandler = errorHandler;

    this.handleStream = this.handleStream.bind(this);
    this.start = this.start.bind(this);
    this.handleOnAudioProcess = this.handleOnAudioProcess.bind(this);
    this.convertFloat32ToInt16 = this.convertFloat32ToInt16.bind(this);
    this.stop = this.stop.bind(this);
  }

  start() {
    // Access the microphone by using getUserMedia method from WebTRC
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then(this.handleStream)
      .catch(this.errorHandler);
  }

  /*
   * handle the raw data from the microphone by use the web audio api to process the audio data
   * web audio api takes input sources and connect thoese sources to nodes
   * createScriptProcessor create a node emit an onaudioproces event
   */
  handleStream(stream: MediaStream) {
    this.globalStream = stream;
    // tslint:disable-next-line no-shadowed-variable
    const AudioContext: AudioContext =
      window.AudioContext || window.webkitAudioContext;
    this.context = new AudioContext();
    this.source = this.context.createMediaStreamSource(stream);
    /*
     * TODO: don't use createScriptProcessor becuse of it is deprecated ⚠️
     *	We Should use audioworklet inested
     */
    this.processor = this.context.createScriptProcessor(2048, 1, 1);
    this.source.connect(this.processor);
    this.processor.connect(this.context.destination);

    this.processor.onaudioprocess = this.handleOnAudioProcess;
  }

  handleOnAudioProcess(event: AudioProcessingEvent) {
    const buffer: Float32Array = event.inputBuffer.getChannelData(0);
    const int16Buffer: Int16Array = this.convertFloat32ToInt16(buffer);
    this.buffer = int16Buffer.buffer;
    this.dataHandler(this.buffer);
  }

  convertFloat32ToInt16(buffer: Float32Array): Int16Array {
    let float32BufferLength: number = buffer.length;
    const int16ArrayBuffer: Int16Array = new Int16Array(float32BufferLength);
    while (float32BufferLength--) {
      int16ArrayBuffer[float32BufferLength] =
        Math.min(1, buffer[float32BufferLength]) * 0x7fff;
    }

    return int16ArrayBuffer;
  }

  async stop() {
    try {
      const track = this.globalStream.getTracks()[0];
      if (track) {
        track.stop();
      }

      this.source.disconnect();
      this.processor.disconnect();

      if (this.context && this.context.state === 'running') {
        await this.context.close();
      }
    } catch (error) {
      this.errorHandler(error);
    }
  }
}

export default AudioStreamer;
