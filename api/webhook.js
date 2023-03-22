import axios from "axios";
import { onCommand } from "./commands";
import { onAction } from "./actions";
import {
  getUser,
  updateUser,
  getZones,
  getFeeForZone,
} from "../utils/firebase";
import { surveyResponse } from "./survey";
import { handleQuestion } from "../utils/openai";
import { defaultResponse } from "../utils/constants";
import { getPhotoUrl, getPhotoData } from "../utils/noaxios";
import { surgeFeeTableParser } from "../utils/docuai";
import { reply, bot } from "../utils/telegram";
const vision = require("@google-cloud/vision");
const pdfParse = require("pdf-parse");
const { DocumentProcessorServiceClient } =
  require("@google-cloud/documentai").v1;

const projectId = "gns-gpt-bot";
const location = "us"; // Format is 'us' or 'eu'
const processorId = "e7a923443fcb4ffb"; // form parser id

const scannerClient = new DocumentProcessorServiceClient();

process.env.NTBA_FIX_319 = "test";

module.exports = async (request, response) => {
  if (request.body.callback_query) {
    // console.log("callback_query", request.body.callback_query);
    await onAction(request.body.callback_query);
    return response.send("OK");
  }

  let ctx = request.body.message;

  ctx.user = await getUser({
    telegramId: ctx.from.id,
  });

  const { message } = request.body;

  if (message?.photo) {
    console.log("------- photo arrived-------");
    const photos = message.photo;
    if (photos.length > 0) {
      const surgeFee = await surgeFeeTableParser(
        photos[photos.length - 1].file_id
      );
      console.log(surgeFee);
    }
  }
  if (message?.document) {
    const pdf = message.document;
    const documentId = pdf.file_id;
    const documentUrl = `https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN_GNSGPTBOT}/getFile?file_id=${documentId}`;
    console.log("documentUrl", documentUrl);
    const urlRes = await axios.get(documentUrl);
    const { file_path } = urlRes.data.result;
    const downloadUrl = `https://api.telegram.org/file/bot${process.env.TELEGRAM_TOKEN_GNSGPTBOT}/${file_path}`;

    console.log("downloadUrl", downloadUrl);
    const response = await axios.get(downloadUrl, {
      responseType: "arraybuffer",
    });
    const imageData = new Uint8Array(response.data);

    console.log("Raw data", imageData);

    const encodedImage = Buffer.from(imageData).toString("base64");
    console.log("encodedImage data", imageData);
    const pdfData = await pdfParse(imageData);
    console.log("actual data", pdfData.text);
    // await defaultResponse(ctx, pdfData.text);
  }

  try {
    if (!request?.body?.message?.text) {
      return response.json({
        body: request.body,
        query: request.query,
        cookies: request.cookies,
      });
    }

    if (ctx.user?.lastCommand === "/start") {
      await surveyResponse(ctx);
      return response.send("OK");
    }
    if (ctx.user?.lastCommand === "talk") {
      await handleQuestion(ctx);
      return response.send("OK");
    }

    // console.log("----- after survey------------------------");
    if (ctx.entities) {
      if (ctx.entities[0]?.type === "bot_command") {
        updateUser({
          telegramId: ctx.from.id,
          lastCommand: ctx.text,
        });
        console.log("handle command: " + ctx.entities[0]);
        await onCommand(
          ctx,
          ctx.text,
          ctx.text.slice(ctx.entities[0].length).toLowerCase()
        );
      }
      return response.send("OK");
    }
    //if not a command or action, go back to main menu
    await defaultResponse(ctx, "Sorry, I did not understand your request.");
    return response.send("OK");

    return response.send("OK");
  } catch (error) {
    console.error("Error sending message");
    console.log("------ req begin-----------------------------------");
    console.log(request);
    console.log("------ req end-----------------------------------");
    console.log(error.toString());
  }
  return response.send("OK");
};
