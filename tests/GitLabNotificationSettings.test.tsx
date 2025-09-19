import { fireEvent, render } from "@testing-library/react-native";
import React from "react";

import { GitLabNotificationSettings } from "@/components/Settings/GitlabNotificationSettings";

describe.skip("GitLabNotificationSettings", () => {
	it("renders all switches correctly", () => {
		const { getByTestId } = render(<GitLabNotificationSettings />);

		expect(getByTestId("all-mode")).toBeTruthy();
		expect(getByTestId("issues-mode")).toBeTruthy();
		expect(getByTestId("mergeRequests-mode")).toBeTruthy();
		expect(getByTestId("pipelineFailures-mode")).toBeTruthy();
		expect(getByTestId("approvals-mode")).toBeTruthy();
	});

	it('toggles the "all" switch and updates other switches', () => {
		const { getByTestId } = render(<GitLabNotificationSettings />);

		const isChecked = (testId: string) => {
			const switchElement = getByTestId(testId);
			// Check if the parent element has the 'bg-primary' class
			return switchElement.parent?.props.className.includes("bg-primary");
		};

		// Check initial state
		expect(isChecked("all-mode")).toBe(false);
		expect(isChecked("issues-mode")).toBe(false);

		// Toggle the "issues" switch
		fireEvent(getByTestId("issues-mode"), "onCheckedChange", true);

		// Assert that the "issues" switch is checked and "all" is not checked
		expect(isChecked("all-mode")).toBe(false);
		expect(isChecked("issues-mode")).toBe(true);

		// Toggle the "mergeRequests" switch
		fireEvent(getByTestId("mergeRequests-mode"), "onCheckedChange", true);

		// Assert that both "issues" and "mergeRequests" are checked, but "all" is still not
		expect(isChecked("all-mode")).toBe(false);
		expect(isChecked("issues-mode")).toBe(true);
		expect(isChecked("mergeRequests-mode")).toBe(true);

		// Toggle the remaining switches
		fireEvent(getByTestId("pipelineFailures-mode"), "onCheckedChange", true);
		fireEvent(getByTestId("approvals-mode"), "onCheckedChange", true);

		// Assert that all switches including "all" are now checked
		expect(isChecked("all-mode")).toBe(true);
		expect(isChecked("issues-mode")).toBe(true);
		expect(isChecked("mergeRequests-mode")).toBe(true);
		expect(isChecked("pipelineFailures-mode")).toBe(true);
		expect(isChecked("approvals-mode")).toBe(true);
	});

	it('toggles individual switches and updates the "all" switch', () => {
		const { getByTestId } = render(<GitLabNotificationSettings />);

		// Toggle the "issues" switch
		fireEvent.press(getByTestId("issues-mode"));

		// Assert that the "issues" switch is checked and "all" is not checked
		expect(getByTestId("all-mode").props.checked).toBe(false);
		expect(getByTestId("issues-mode").props.checked).toBe(true);

		// Toggle the "mergeRequests" switch
		fireEvent.press(getByTestId("mergeRequests-mode"));

		// Assert that the "mergeRequests" switch is checked and "all" is not checked
		expect(getByTestId("all-mode").props.checked).toBe(false);
		expect(getByTestId("mergeRequests-mode").props.checked).toBe(true);

		// Toggle the "pipelineFailures" switch
		fireEvent.press(getByTestId("pipelineFailures-mode"));

		// Assert that the "pipelineFailures" switch is checked and "all" is not checked
		expect(getByTestId("all-mode").props.checked).toBe(false);
		expect(getByTestId("pipelineFailures-mode").props.checked).toBe(true);

		// Toggle the "approvals" switch
		fireEvent.press(getByTestId("approvals-mode"));

		// Assert that the "approvals" switch is checked and "all" is checked
		expect(getByTestId("all-mode").props.checked).toBe(true);
		expect(getByTestId("approvals-mode").props.checked).toBe(true);
	});
});
