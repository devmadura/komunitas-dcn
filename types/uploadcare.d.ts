import "react";

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "uc-config": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          "ctx-name"?: string;
          pubkey?: string;
          "img-only"?: string;
          multiple?: string;
          "max-local-file-size-bytes"?: string;
          "use-cloud-image-editor"?: string;
        },
        HTMLElement
      >;
      "uc-upload-ctx-provider": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          "ctx-name"?: string;
        },
        HTMLElement
      >;
      "uc-file-uploader-regular": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          "ctx-name"?: string;
          class?: string;
        },
        HTMLElement
      >;
      "uc-data-output": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          "ctx-name"?: string;
          "use-event"?: string;
        },
        HTMLElement
      >;
    }
  }
}
