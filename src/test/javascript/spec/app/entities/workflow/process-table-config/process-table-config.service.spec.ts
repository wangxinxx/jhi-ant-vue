/* tslint:disable max-line-length */
import axios from 'axios';

import * as config from '@/shared/config/config';
import {} from '@/shared/date/filters';
import ProcessTableConfigService from '@/business/workflow/process-table-config/process-table-config.service';
import { ProcessTableConfig } from '@/shared/model/workflow/process-table-config.model';

const mockedAxios: any = axios;
jest.mock('axios', () => ({
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn()
}));

describe('Service Tests', () => {
  describe('ProcessTableConfig Service', () => {
    let service: ProcessTableConfigService;
    let elemDefault;
    beforeEach(() => {
      service = new ProcessTableConfigService();

      elemDefault = new ProcessTableConfig(0, 'AAAAAAA', 'AAAAAAA', 'AAAAAAA', 'AAAAAAA', 'AAAAAAA', false);
    });

    describe('Service methods', () => {
      it('should find an element', async () => {
        const returnedFromService = Object.assign({}, elemDefault);
        mockedAxios.get.mockReturnValue(Promise.resolve({ data: returnedFromService }));

        return service.find(123).subscribe(res => {
          expect(res).toMatchObject(elemDefault);
        });
      });
      it('should create a ProcessTableConfig', async () => {
        const returnedFromService = Object.assign(
          {
            id: 0
          },
          elemDefault
        );
        const expected = Object.assign({}, returnedFromService);

        mockedAxios.post.mockReturnValue(Promise.resolve({ data: returnedFromService }));
        return service.create({}).subscribe(res => {
          expect(res).toMatchObject(expected);
        });
      });

      it('should update a ProcessTableConfig', async () => {
        const returnedFromService = Object.assign(
          {
            processDefinitionId: 'BBBBBB',
            processDefinitionKey: 'BBBBBB',
            processDefinitionName: 'BBBBBB',
            description: 'BBBBBB',
            processBpmnData: 'BBBBBB',
            deploied: true
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);
        mockedAxios.put.mockReturnValue(Promise.resolve({ data: returnedFromService }));

        return service.update(expected).subscribe(res => {
          expect(res).toMatchObject(expected);
        });
      });
      it('should return a list of ProcessTableConfig', async () => {
        const returnedFromService = Object.assign(
          {
            processDefinitionId: 'BBBBBB',
            processDefinitionKey: 'BBBBBB',
            processDefinitionName: 'BBBBBB',
            description: 'BBBBBB',
            processBpmnData: 'BBBBBB',
            deploied: true
          },
          elemDefault
        );
        const expected = Object.assign({}, returnedFromService);
        mockedAxios.get.mockReturnValue(Promise.resolve([returnedFromService]));
        return service.retrieve({ sort: {}, page: 0, size: 10 }).subscribe(res => {
          expect(res).toContainEqual(expected);
        });
      });
      it('should delete a ProcessTableConfig', async () => {
        mockedAxios.delete.mockReturnValue(Promise.resolve({ ok: true }));
        return service.delete(123).subscribe(res => {
          expect(res.data.ok).toBeTruthy();
        });
      });
    });
  });
});
