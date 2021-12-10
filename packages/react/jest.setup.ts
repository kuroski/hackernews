import { server } from "@kuroski-hackernews/framework";

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
