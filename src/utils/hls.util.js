import path from "path";
import { promisify } from "util";
import { exec } from "child_process";
import ffmpegPath from "ffmpeg-static";

const execPromise = promisify(exec);

const convertToHLS = async (inputPath, outputDir, episodeName) => {
  try {
    const outputPath = path.join(outputDir, `${episodeName}.m3u8`);
    const command = `"${ffmpegPath}" -i "${inputPath}" -crf 17 -tune animation -level 4.0 -start_number 0 -hls_time 10 -hls_list_size 0 -f hls "${outputPath}"`;
    
    await execPromise(command);
    return outputPath;
  } catch (err) {
    throw err;
  }
};

export default convertToHLS;