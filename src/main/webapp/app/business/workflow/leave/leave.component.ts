import { mixins } from 'vue-class-component';
import { Component, Inject, Prop, Ref } from 'vue-property-decorator';
import Vue2Filters from 'vue2-filters';
import { ILeave, Leave } from '@/shared/model/workflow/leave.model';
import AlertMixin from '@/shared/alert/alert.mixin';

import LeaveService from './leave.service';
import { IUser } from '@/shared/model/user.model';
import UserService from '@/shared/service/user.service';
import { ICommonTable } from '@/shared/model/modelConfig/common-table.model';
import CommonTableService from '@/business/modelConfig/common-table/common-table.service';
import { AxiosResponse } from 'axios';
import { getFilter, xGenerateFilterTree, xGenerateTableColumns } from '@/utils/entity-list-utils';
import { FieldType } from '@/shared/model/modelConfig/common-table-field.model';
import { UPLOAD_IMAGE_URL } from '@/constants';
import { forkJoin } from 'rxjs';

@Component
export default class LeaveComponent extends mixins(Vue2Filters.mixin, AlertMixin) {
  @Inject('leaveService') private leaveService: () => LeaveService;
  @Inject('userService') private userService: () => UserService;
  @Inject('commonTableService') private commonTableService: () => CommonTableService;
  @Ref('searchInput') public searchInput;
  @Ref('xGrid') public xGrid;
  public xGridData = [];
  public xGridColumns = [];
  public xGridTableToolbars = {
    perfect: true,
    custom: true,
    slots: {
      buttons: 'toolbar_buttons'
    }
  };
  public xGridTreeConfig: boolean | Object = false;
  public xGridSelectRecords = [];
  private loading: boolean = false;
  public relationshipsData: any = {};
  public xGridPagerConfig = {
    layouts: ['Sizes', 'PrevJump', 'PrevPage', 'Number', 'NextPage', 'NextJump', 'FullJump', 'Total'],
    pageSize: 15,
    pageSizes: [5, 10, 15, 20, 30, 50],
    total: 0,
    pagerCount: 5,
    currentPage: 1
  };

  public xGridFilterConfig = {
    remote: true
  };

  private removeId: number = null;
  public itemsPerPage = 20;
  public queryCount: number = null;
  public page = 1;
  public previousPage = 1;
  public propOrder = 'id';
  public filterTreeSpan = 0;

  @Prop(Object) otherPresetOrder: { [key: string]: any };
  public treeFilterData = [];
  public expandedKeys = [];
  public autoExpandParent = true;
  public checkedKeys = [];
  public selectedKeys = [];
  public mapOfSort: { [key: string]: any } = {};
  public reverse = false;
  public totalItems = 0;
  public authHeader = { Authorization: 'Bearer ' };
  public uploadImageUrl = UPLOAD_IMAGE_URL;
  public previewImage: string | undefined = '';
  public previewVisible = false;
  public showUploadList = {
    showPreviewIcon: true,
    showRemoveIcon: true,
    hidePreviewIconInNonImage: true
  };
  public omitFields = ['id'];
  public leaves: ILeave[] = [];
  public mapOfFilter: { [key: string]: any } = {
    images: { list: [], value: [], type: 'one-to-many' },
    creator: { list: [], value: [], type: 'many-to-one' }
  };
  public editStatus: { [key: string]: any } = {};
  public isFetching = false;
  public searchValue = '';
  usersNzTreeNodes: any[]; // todo 有时可能多余。
  users: IUser[];

  public created(): void {
    this.initRelationships();
  }

  public mounted(): void {
    const token = localStorage.getItem('jhi-authenticationToken') || sessionStorage.getItem('jhi-authenticationToken');
    this.authHeader.Authorization = 'Bearer ' + token;
    this.loadAll();
  }

  public clear(): void {
    this.xGridPagerConfig.currentPage = 1;
    this.loadAll();
  }
  public loadAll(): void {
    this.loading = true;

    const paginationQuery = {
      listModelName: 'Leave',
      page: this.xGridPagerConfig.currentPage - 1,
      size: this.xGridPagerConfig.pageSize,
      sort: this.sort(),
      filter: getFilter(this.searchValue, this.mapOfFilter)
    };
    this.leaveService()
      .retrieve(paginationQuery)
      .subscribe(
        res => {
          this.xGridData = res.data;
          this.xGridPagerConfig.total = Number(res.headers['x-total-count']);
          this.loading = false;
        },
        err => {
          this.$message.error(err.message);
          this.loading = false;
        }
      );
  }

  public prepareRemove(instance: ILeave): void {
    this.removeId = instance.id;
  }

  public removeById(removeId: number): void {
    this.leaveService()
      .delete(removeId)
      .subscribe((res: AxiosResponse) => {
        const message = this.$t('jhiAntVueApp.workflowLeave.deleted', { param: this.removeId }).toString();
        this.$message.success(message);
        this.loadAll();
      });
  }
  public removeByIds(ids: string[]) {
    this.leaveService()
      .deleteByIds(ids)
      .subscribe(
        (res: AxiosResponse) => {
          this.$message.success('删除成功');
          this.loadAll();
        },
        err => this.$message.error(err.message)
      );
  }

  public sort(): Array<any> {
    const result = [];
    Object.keys(this.mapOfSort).forEach(key => {
      if (this.mapOfSort[key] && this.mapOfSort[key] !== false) {
        if (this.mapOfSort[key] === 'ascend') {
          result.push(key + ',asc');
        } else if (this.mapOfSort[key] === 'descend') {
          result.push(key + ',desc');
        }
      }
    });
    return result;
  }

  public loadPage(page: number): void {
    if (page !== this.previousPage) {
      this.previousPage = page;
      this.transition();
    }
  }

  public transition(): void {
    this.loadAll();
  }

  public changeOrder(propOrder): void {
    this.propOrder = propOrder;
    this.reverse = !this.reverse;
    this.transition();
  }

  public closeDialog(): void {
    (<any>this.$refs.removeEntity).hide();
  }

  public editEntity(row: ILeave): void {
    this.$router.push({ path: row.id + '/edit', append: true });
  }

  getCommonTableData() {
    this.commonTableService()
      .findByEntityName('Leave')
      .subscribe(res => {
        this.xGridColumns = xGenerateTableColumns(res.data, this.relationshipsData, this.mapOfSort, this.mapOfFilter, this.changeEvent);
        this.treeFilterData = xGenerateFilterTree(res.data, this.relationshipsData);
        if (res.data.treeTable) {
          this.xGridTreeConfig = { children: 'children', indent: 20, line: false, expandAll: false, accordion: false, trigger: 'default' };
        }
        if (this.treeFilterData && this.treeFilterData.length > 0) {
          this.filterTreeSpan = 6;
        }
        this.loading = false;
      });
  }

  filterByColumn(fieldName: string, filterValue: string[]) {
    this.mapOfFilter[fieldName].value = filterValue;
    this.loadAll();
  }
  getFilterTest() {
    const result: { [key: string]: any } = {};
    if (this.searchValue) {
      result['jhiCommonSearchKeywords'] = this.searchValue;
      return result;
    }
    Object.keys(this.mapOfFilter).forEach(key => {
      const filterResult = [];
      if (this.mapOfFilter[key].type === 'Enum') {
        this.mapOfFilter[key].value.forEach(value => {
          filterResult.push(value);
        });
        result[key + '.in'] = filterResult;
      }
      if (['one-to-one', 'many-to-many', 'many-to-one', 'one-to-many'].includes(this.mapOfFilter[key].type)) {
        this.mapOfFilter[key].value.forEach(value => {
          filterResult.push(value);
        });
        result[key + 'Id.in'] = filterResult;
      }
    });
    return result;
  }

  cancelEdit(id: string): void {
    this.loadAll();
  }

  emitEmpty() {
    this.searchInput.focus();
    this.searchValue = '';
  }

  public newEntity(): void {
    this.$router.push({ path: 'new', append: true });
  }
  public beforeUpload(file) {
    const isJPG = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif';
    if (!isJPG) {
      this.$message.error('You can only upload JPG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 4;
    if (!isLt2M) {
      this.$message.error('Image must smaller than 4MB!');
    }
    return isJPG && isLt2M;
  }
  public getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  }
  private checkImageDimension(file: File): Promise<boolean> {
    return new Promise(resolve => {
      const img = new Image(); // create image
      img.src = window.URL.createObjectURL(file);
      img.onload = () => {
        const width = img.naturalWidth;
        const height = img.naturalHeight;
        window.URL.revokeObjectURL(img.src);
        resolve(width === height && width >= 3000);
      };
    });
  }
  public handlePreview(file) {
    this.previewImage = file.url || file.thumbUrl;
    this.previewVisible = true;
  }
  public handlePreviewCancel() {
    this.previewVisible = false;
  }
  public onExpand(expandedKeys) {
    console.log('onExpand', expandedKeys);
    // if not set autoExpandParent to false, if children expanded, parent can not collapse.
    // or, you can remove all expanded children keys.
    this.expandedKeys = expandedKeys;
    this.autoExpandParent = false;
  }
  public onCheck(checkedKeys) {
    console.log('onCheck', checkedKeys);
    this.checkedKeys = checkedKeys;
  }
  public onSelect(selectedKeys, info) {
    console.log('onSelect', info);
    console.log('record', info.node.record);
    const filterData = info.node.dataRef;
    if (filterData.type === 'filterGroup') {
      this.mapOfFilter[info.node.dataRef.key].value = [];
    } else if (filterData.type === 'filterItem') {
      this.mapOfFilter[info.node.dataRef.filterName].value = [info.node.dataRef.filterValue];
    }
    this.loadAll();
    this.selectedKeys = selectedKeys;
  }

  public editClosedEvent({ row, column }) {
    let field = column.property;
    let cellValue = row[field];
    // 判断单元格值是否被修改
    if (this.xGrid.isUpdateByRow(row, field)) {
      const entity = { id: row.id };
      entity[field] = cellValue;
      this.leaveService()
        .updateBySpecifiedField(entity, field)
        .subscribe(
          res => {
            if (res.status === 200) {
              this.$message.success({
                content: `信息更新成功。 ${field}=${cellValue}`,
                duration: 1
              });
              this.xGrid.reloadRow(row, null, field);
            } else {
              this.$message.warning({
                content: `信息保存可能存在问题！ ${field}=${cellValue}`,
                duration: 5
              });
              this.xGrid.reloadRow(row, null, field);
            }
          },
          error => {
            this.$message.error({
              content: `信息保存可能存在问题！ ${field}=${cellValue}`,
              onClose: () => {}
            });
          }
        );
    }
  }

  public xGridCheckboxChangeEvent() {
    this.xGridSelectRecords = this.xGrid.getCheckboxRecords();
  }
  public changeEvent(e) {
    console.log(e);
  }

  public initRelationships(): void {
    this.loading = true;
    forkJoin([this.userService().retrieve()]).subscribe(
      ([users]) => {
        this.relationshipsData['users'] = users.data;
        const listOfFiltercreator = users.data.slice(0, users.data.length > 8 ? 7 : users.data.length - 1);
        this.mapOfFilter.creator = { list: listOfFiltercreator, value: [], type: 'many-to-one' };
        this.getCommonTableData();
      },
      error => {
        this.loading = false;
        this.$message.error({
          content: `数据获取失败`,
          onClose: () => {}
        });
      }
    );
  }

  public xGridPageChange({ currentPage, pageSize }) {
    this.xGridPagerConfig.currentPage = currentPage;
    this.xGridPagerConfig.pageSize = pageSize;
    this.loadAll();
  }

  public xGridSortChange({ property, order }) {
    this.mapOfSort = {};
    this.mapOfSort[property] = order;
    this.loadAll();
  }

  public xGridFilterChange({ column, property, values, datas, filters, $event }) {
    const type = column.params ? column.params.type : '';
    var tempValues;
    if (type === 'STRING') {
      tempValues = values;
    }
    if (type === 'INTEGER' || type === 'LONG' || type === 'DOUBLE' || type === 'FLOAT' || type === 'ZONED_DATE_TIME') {
      tempValues = datas[0];
    }
    this.mapOfFilter[property] = { value: tempValues, type: type };
    this.loadAll();
  }
}
