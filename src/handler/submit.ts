import {IAjaxcomCallbacks} from "../options/callbacks";
import {IFetchOptions} from "../options/fetchOptions";
import {IAjaxcomSelectors} from "../options/selectors";
import {request} from "./request";

export function toHandleSubmit(options?: Partial<IAjaxcomSelectors & IAjaxcomCallbacks>) {
    return (event: Event) => {
        const form = event.target as HTMLFormElement;

        if (false === form.matches(options.formsSelector)) { return; }
        if (form.tagName.toUpperCase() !== "FORM") { return; }
        event.preventDefault();

        const formData = new FormData(form);
        const fetchOptions = {
            ...options,
            method: form.method,
            url: form.action,
        };

        request(form.method.toUpperCase() === "GET"
            ? fetchOptionsForGet(formData, fetchOptions)
            : fetchOptionsForPost(formData, fetchOptions),
        );
    };
}

type SubmitOptions = Partial<IAjaxcomCallbacks & IFetchOptions>;

function fetchOptionsForPost(formData: FormData, fetchOptions: SubmitOptions): SubmitOptions {
    return {
        ...fetchOptions,
        body: formData,
    };
}

function fetchOptionsForGet(formData: any, fetchOptions: SubmitOptions): SubmitOptions {
    const query = [...formData.entries()].map((pair) => `${encodeURIComponent(pair[0])}=${pair[1]}`).join("&");
    const glue = fetchOptions.url.indexOf("?") === -1 ? "?" : "&";

    return {
        ...fetchOptions,
        url: [fetchOptions.url, glue, query].join(""),
    };
}
