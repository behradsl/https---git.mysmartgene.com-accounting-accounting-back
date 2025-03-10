import { SampleStatus } from '@prisma/client';

export function sampleStatusCalculate(
  dataSampleReceived?: string,
  sampleExtractionDate?: string,
  dataSentToKorea?: string,
  rawFileReceivedDate?: string,
  analysisCompletionDate?: string,
) {
  if (
    dataSampleReceived &&
    !sampleExtractionDate &&
    !dataSentToKorea &&
    !rawFileReceivedDate &&
    !analysisCompletionDate
  ) {
    return SampleStatus.SAMPLE_RECEIVED;
  }

  if (
    sampleExtractionDate &&
    !dataSentToKorea &&
    !rawFileReceivedDate &&
    !analysisCompletionDate
  ) {
    return SampleStatus.DNA_EXTRACTED;
  }

  if (dataSentToKorea && !rawFileReceivedDate && !analysisCompletionDate) {
    return SampleStatus.SENT_TO_KOREA;
  }

  if (rawFileReceivedDate && !analysisCompletionDate) {
    return SampleStatus.RAW_FILE_RECEIVED;
  }

  if (analysisCompletionDate) {
    return SampleStatus.ANALYZED;
  }

  return SampleStatus.SAMPLE_RECEIVED;
}
