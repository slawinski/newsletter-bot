import { extractUrl } from "../utils/issues.util";

describe("extractUrl", () => {
  type TestTuple = [string | null, string | null | undefined | number | boolean | Array<any> | Record<string, never>];

  const testCases: TestTuple[] = [
    ["https://www.example.com", "This is a test message with a url https://www.example.com."],
    [null, "This is a test message without a URL"],
    ["https://www.example.com/", "This is a test message with a URL followed by a comma https://www.example.com/,"],
    ["https://www.example1.com/", "This is a test message with multiple URLs https://www.example1.com/ and https://www.example2.com/."],
    ["https://www.example.com", "https://www.example.com is a URL on its own"],
    ["https://www.example.com", "https://www.example.com."],
    ["https://www.example.com", "(https://www.example.com)"],
    ["https://www.example.com/path/to/page.html", "https://www.example.com/path/to/page.html"],
    ["https://www.example.com/?q=hello+world", "https://www.example.com/?q=hello+world"],
    ["https://www.example.com/#section1", "https://www.example.com/#section1"],
    ["https://www.example.com/", "This message has an invalid URL https://www.example.com/ followed by some random text / end of message"],
    ["Input is not a string", null],
    ["Input is not a string", undefined],
    ["Input is not a string", {}],
    ["Input is not a string", []],
    ["Input is not a string", 123],
    ["Input is not a string", true]
  ];
  
  it.each<TestTuple>(testCases)("returns '%s' when given '%s'", (result, input) => {
    expect(extractUrl(input as unknown as string)).toEqual(result);
  });
});
