export const ERROR_MESSAGES = {
  UNABLE_TO_FIND_FIXTURE_NAME: `
        Mockingbird can not find fixture named '%name'. \n
        Maybe you are trying to load a variant of another fixture?
        Possible solution: MockFactory(<base-fixture-name>).variant(<fixture-variant-name>)
        
        Looked for file '%name.fixture.json' under %path
        `,
} as const;

export const WARNING_MESSAGES = {} as const;
