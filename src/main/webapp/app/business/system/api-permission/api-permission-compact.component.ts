import { mixins } from 'vue-class-component';
import { Component, Inject, Prop, Ref } from 'vue-property-decorator';
import Vue2Filters from 'vue2-filters';
import { IApiPermission, ApiPermission } from '@/shared/model/system/api-permission.model';
import AlertMixin from '@/shared/alert/alert.mixin';

import ApiPermissionService from './api-permission.service';
import { IViewPermission } from '@/shared/model/system/view-permission.model';
import ViewPermissionService from '@/business/system/view-permission/view-permission.service';
import { ICommonTable } from '@/shared/model/modelConfig/common-table.model';
import CommonTableService from '@/business/modelConfig/common-table/common-table.service';
import { AxiosResponse } from 'axios';
import { xGenerateTableColumns, xGenerateFilterTree } from '@/utils/entity-list-utils';
import { FieldType } from '@/shared/model/modelConfig/common-table-field.model';
import { forkJoin } from 'rxjs';

@Component
export default class ApiPermissionCompactComponent extends mixins(Vue2Filters.mixin, AlertMixin) {
  @Inject('apiPermissionService') private apiPermissionService: () => ApiPermissionService;
  @Inject('viewPermissionService') private viewPermissionService: () => ViewPermissionService;
  @Inject('commonTableService') private commonTableService: () => CommonTableService;
  @Ref() public searchInput;
  @Ref('xGridCompact') public xGridCompact;
  public xGridData = [];
  public xGridColumns = [];
  public xGridTableToolbars = {
    perfect: true,
    refresh: true,
    zoom: true,
    custom: true,
    slots: {
      buttons: 'toolbar_buttons'
    }
  };
  public xGridSelectRecords = [];
  private loading: boolean = false;
  public relationshipsData: any = {};
  public xGridPagerConfig = {
    layouts: ['PrevPage', 'NextPage', 'Sizes', 'Total'],
    pageSize: 15,
    pageSizes: [5, 10, 15, 20, 30, 50],
    total: 0,
    pagerCount: 5,
    currentPage: 1
  };

  @Ref('dataGrid') public dataGrid;
  private removeId: number = null;
  public itemsPerPage = 20;
  public queryCount: number = null;
  public page = 1;
  public previousPage = 1;
  public propOrder = 'id';
  public filterTreeSpan = 0;
  public dataTableColumns = [];
  public dataTableParams = {
    Status: 1,
    PageSize: 5
  };
  public dataTableProps = {
    bordered: true
  };
  public dataTableEventConfig = {
    tabToActive: true, //Tab键进入下一个单元格编辑
    enterToActive: true, //回车键进入下一个单元格编辑
    rightArrowToActive: true, //向右箭头激活同一行下一列的编辑
    leftArrowToActive: true, //向左箭头激活同一行前一列的编辑
    upArrowToActive: true, //向上箭头激活上一行相同列的编辑
    downArrowToActive: true, //向下箭头激活下一行相同列的编辑
    resizeableColumn: false //列宽拖拽调整,设为true的话，column必须设宽度值，且为整数，如：width:100
  };
  @Prop(Object) otherPresetOrder: { [key: string]: any };
  public treeFilterData = [];
  public expandedKeys = [];
  public autoExpandParent = true;
  public checkedKeys = [];
  public selectedKeys = [];
  public mapOfSort: { [key: string]: any } = {};
  public reverse = false;
  public totalItems = 0;
  public omitFields = ['id'];
  public apiPermissions: IApiPermission[] = [];
  public apiPermissionCommonTableData: ICommonTable = null; // 实体模型数据
  public mapOfFilter: { [key: string]: any } = {
    children: { list: [], value: [], type: 'one-to-many' },
    parent: { list: [], value: [], type: 'many-to-one' },
    viewPermissions: { list: [], value: [], type: 'many-to-many' }
  };
  public editStatus: { [key: string]: any } = {};
  public isFetching = false;
  public searchValue = '';
  apipermissionsNzTreeNodes: any[]; // todo 有时可能多余。
  apipermissions: IApiPermission[];
  viewpermissionsNzTreeNodes: any[]; // todo 有时可能多余。
  viewpermissions: IViewPermission[];

  public created(): void {
    this.initRelationships();
  }

  public mounted(): void {
    this.loadAll();
  }

  public clear(): void {
    this.xGridPagerConfig.currentPage = 1;
    this.loadAll();
  }
  public loadAll(): void {
    this.loading = true;

    const paginationQuery = {
      page: this.xGridPagerConfig.currentPage - 1,
      size: this.xGridPagerConfig.pageSize,
      sort: this.sort(),
      filter: this.getFilter()
    };
    this.apiPermissionService()
      .tree()
      .subscribe(
        res => {
          this.xGridData = this.removeBlankChildren(res.data);
          this.xGridPagerConfig.total = Number(res.headers['x-total-count']);
          this.loading = false;
        },
        err => {
          this.$message.error(err.message);
          this.loading = false;
        }
      );
  }

  public prepareRemove(instance: IApiPermission): void {
    this.removeId = instance.id;
  }

  public removeById(removeId: number): void {
    this.apiPermissionService()
      .delete(removeId)
      .subscribe((res: AxiosResponse) => {
        const message = this.$t('jhiAntVueApp.systemApiPermission.deleted', { param: this.removeId }).toString();
        this.$message.success(message);
        this.loadAll();
      });
  }
  public removeByIds(ids: string[]) {
    this.apiPermissionService()
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

  handleTableChange(pagination, filters, sorter) {
    if (sorter && sorter.columnKey) {
      this.propOrder = sorter.columnKey;
      this.reverse = sorter.order === 'ascend';
    } else {
      this.propOrder = 'id';
      this.reverse = false;
    }
    Object.keys(filters).forEach(key => {
      this.mapOfFilter[key].value = filters[key];
    });
    this.page = pagination.current;
    this.loadAll();
  }

  getCommonTableData() {
    this.loading = true;
    this.commonTableService()
      .findByEntityName('ApiPermission')
      .subscribe(
        res => {
          this.xGridColumns = xGenerateTableColumns(
            res.data,
            this.relationshipsData,
            this.mapOfSort,
            this.mapOfFilter,
            this.changeEvent,
            true
          );
          this.treeFilterData = xGenerateFilterTree(res.data, this.relationshipsData);
          if (this.treeFilterData && this.treeFilterData.length > 0) {
            this.filterTreeSpan = 6;
          }
          this.loading = false;
        },
        error => {
          this.loading = false;
          this.$message.error(error.message);
        }
      );
  }

  filterByColumn(fieldName: string, filterValue: string[]) {
    this.mapOfFilter[fieldName].value = filterValue;
    this.loadAll();
  }
  getFilter() {
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
  // 新增Article 并设置为可编辑状态
  newApiPermission() {
    const apiPermission = new ApiPermission();
    apiPermission.id = -1;
    this.apiPermissions.push(apiPermission);
    this.editStatus[apiPermission.id].edit = true;
  }

  emitEmpty() {
    this.searchInput.focus();
    this.searchValue = '';
  }

  public newEntity(): void {
    this.$router.push({ path: 'new', append: true });
  }
  /**
   * 清除树形结构的空子树
   * 主要用在table标签中，否则可能会显示无意义的+号。
   * @param data
   */
  public removeBlankChildren(data: any[]) {
    return data.reduce((pre, cur) => {
      if (cur.children) {
        if (cur.children.length === 0) {
          delete cur.children;
        } else {
          cur.children = this.removeBlankChildren(cur.children);
        }
      }
      pre.push(cur);
      return pre;
    }, []);
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

  public initRelationships(): void {
    this.loading = true;
    forkJoin([this.apiPermissionService().tree(), this.viewPermissionService().tree()]).subscribe(
      ([apiPermissions, viewPermissions]) => {
        this.relationshipsData['apiPermissions'] = apiPermissions.data;
        this.relationshipsData['viewPermissions'] = viewPermissions.data;
        const listOfFilterparent = apiPermissions.data.slice(0, apiPermissions.data.length > 8 ? 7 : apiPermissions.data.length - 1);
        this.mapOfFilter.parent = { list: listOfFilterparent, value: [], type: 'many-to-one' };
        const listOfFilterviewPermissions = viewPermissions.data.slice(
          0,
          viewPermissions.data.length > 8 ? 7 : viewPermissions.data.length - 1
        );
        this.mapOfFilter.viewPermissions = { list: listOfFilterviewPermissions, value: [], type: 'many-to-many' };
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

  public changeEvent(e) {
    console.log(e);
  }

  public xGridPageChange({ currentPage, pageSize }) {
    this.xGridPagerConfig.currentPage = currentPage;
    this.xGridPagerConfig.pageSize = pageSize;
    this.loadAll();
  }

  public handleCancel() {
    this.$emit('cancel');
  }

  public handleOK() {
    this.$emit('ok', this.xGridSelectRecords);
  }

  public xGridCheckboxChangeEvent() {
    this.xGridSelectRecords = this.xGridCompact.getCheckboxRecords();
  }
}
