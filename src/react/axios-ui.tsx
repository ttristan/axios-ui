import React from "react";

import Icon from "./icon";
import { AxiosUIData, AxiosUIRequestData, AxiosUIResponseData } from "../types";

import inlineStyles, { getStyle, Styles } from "./axios-ui-styles";

export type AxiosUIProps = {
  axiosData: AxiosUIData;
  clearData: () => void;
  renderShortUrl?: (url: string) => string;
  options?: {
    maxInitialResponseLength?: number;
    styleOverrides?: Partial<Styles>;
    disableInlineStyles?: boolean;
  };
};

export default function AxiosUI({
  axiosData,
  clearData,
  renderShortUrl,
  options,
}: AxiosUIProps) {
  const { maxInitialResponseLength = 500, disableInlineStyles = false } =
    options || {};
  const styles =
    disableInlineStyles === true
      ? ({} as Styles)
      : {
          ...inlineStyles,
          ...options?.styleOverrides,
        };

  const [isOpen, setOpen] = React.useState(false);
  const [selectedRequest, setSelectedRequest] = React.useState<string | null>(
    null
  );

  return (
    <>
      <button
        className="icon"
        style={styles.icon}
        onClick={() => setOpen(!isOpen)}
      >
        <Icon />
      </button>
      {isOpen && (
        <div className="devtools" style={styles.devtools}>
          <button
            className="button"
            style={styles.button}
            onClick={() => setOpen(false)}
          >
            Close
          </button>
          <button
            className="button clearButton"
            style={{ ...styles.button, ...styles.clearButton }}
            onClick={clearData}
          >
            Clear
          </button>
          {Object.entries(axiosData).map(
            ([debugRequestId, { request, response }]) => (
              <React.Fragment key={debugRequestId}>
                <div
                  onClick={() =>
                    selectedRequest === debugRequestId
                      ? setSelectedRequest(null)
                      : setSelectedRequest(debugRequestId)
                  }
                  className="requestRow"
                  style={styles.requestRow}
                >
                  <div
                    className={`method method${request.method}`}
                    style={{
                      ...styles.method,
                      ...getStyle(styles, `method${request.method}`),
                    }}
                  >
                    {request.method}
                  </div>
                  <div>{new Date(request.time).toLocaleTimeString()}</div>
                  {request.debugToken && (
                    <div>{request.debugToken.substring(0, 5)}</div>
                  )}
                  <Url
                    renderShortUrl={renderShortUrl}
                    request={request}
                    selectedRequest={selectedRequest}
                    debugRequestId={debugRequestId}
                    styles={styles}
                  />
                </div>
                {selectedRequest === debugRequestId && (
                  <div className="selectedRequest" style={styles.selectedRequest}>
                    <div className="date" style={styles.date}>
                      {new Date(request.time).toLocaleString()}{" "}
                      {response && `(${response.time - request.time}ms)`}
                    </div>
                    <div>
                      <b>Request Headers</b>
                      <pre className="pre" style={styles.pre}>
                        {JSON.stringify(request.headers, null, 2)}
                      </pre>
                    </div>
                    {response && (
                      <Response
                        response={response}
                        styles={styles}
                        maxInitialResponseLength={maxInitialResponseLength}
                      />
                    )}
                  </div>
                )}
              </React.Fragment>
            )
          )}
        </div>
      )}
    </>
  );
}

const Url = ({
  request,
  debugRequestId,
  selectedRequest,
  styles,
  renderShortUrl,
}: {
  request: AxiosUIRequestData;
  debugRequestId: string;
  selectedRequest: string | null;
  styles: Styles;
  renderShortUrl: AxiosUIProps["renderShortUrl"];
}) => {
  const isSelected = selectedRequest === debugRequestId;
  const style = { ...styles.url, ...(!isSelected ? styles.urlCollapsed : {}) };
  const className = "url" + !isSelected && "urlCollapsed";

  return (
    <div className={className} style={style}>
      {selectedRequest !== debugRequestId && renderShortUrl
        ? renderShortUrl(request.url)
        : request.url}
    </div>
  );
};

const Response = ({
  response,
  maxInitialResponseLength,
  styles,
}: {
  response: AxiosUIResponseData;
  maxInitialResponseLength: number;
  styles: Styles;
}) => {
  const responseStringified = JSON.stringify(response.data, null, 2);
  const responseStringShort = responseStringified.substring(
    0,
    maxInitialResponseLength
  );
  const isResponseTooLong =
    responseStringified.length > maxInitialResponseLength;

  const [showFullResponse, setShowFullResponse] = React.useState(
    !isResponseTooLong
  );

  const responseString = showFullResponse
    ? responseStringified
    : responseStringShort;

  return (
    <>
      <div>
        <b>Response Headers</b>
        <pre className="pre" style={styles.pre}>
          {JSON.stringify(response.headers, null, 2)}
        </pre>
      </div>
      <div>
        <b>Response</b>
        <pre className="pre" style={styles.pre}>
          {responseString}
        </pre>
        {!showFullResponse && isResponseTooLong && (
          <button
            className="showFullResponse"
            style={styles.showFullResponse}
            onClick={() => setShowFullResponse(true)}
          >
            <u>Show full response</u>
          </button>
        )}
      </div>
    </>
  );
};
