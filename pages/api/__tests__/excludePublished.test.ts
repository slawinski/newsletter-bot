import { excludePublished } from "../utils/issues.util";
import mockInputWithoutLabel from '../__mocks__/input-without-label.json'
import mockInputWithLabel from '../__mocks__/input-with-label.json'
import mockResult from '../__mocks__/result.json'

describe('excludeAlreadyPublished', () => {
  it('returns empty array when given empty input', () => {
    const result = excludePublished({ data: [] });
    expect(result).toEqual([]);
  });

  it('returns input when none of the issues have the "slack-published" label', () => {
    
    const result = excludePublished(mockInputWithoutLabel);
    expect(result).toEqual(mockInputWithoutLabel.data);
  });

  it('returns input without issues that have the "slack-published" label', () => {
    const result = excludePublished(mockInputWithLabel);
    expect(result).toEqual(mockResult);
  });
});
