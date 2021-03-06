package com.aidriveall.cms.web.rest;

import cn.hutool.core.bean.BeanUtil;
import com.aidriveall.cms.service.CompanyUserService;
import com.aidriveall.cms.web.rest.errors.BadRequestAlertException;
import com.aidriveall.cms.service.dto.CompanyUserDTO;
import com.aidriveall.cms.service.dto.CompanyUserCriteria;
import com.aidriveall.cms.service.CompanyUserQueryService;

import io.github.jhipster.web.util.HeaderUtil;
import io.github.jhipster.web.util.PaginationUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import cn.afterturn.easypoi.excel.ExcelExportUtil;
import cn.afterturn.easypoi.excel.ExcelImportUtil;
import cn.afterturn.easypoi.excel.entity.ExportParams;
import cn.afterturn.easypoi.excel.entity.ImportParams;
import cn.afterturn.easypoi.util.PoiPublicUtil;

import org.apache.poi.ss.usermodel.Workbook;


import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.ArrayList;
import java.util.Set;
import java.util.Optional;
import java.util.UUID;

// jhipster-needle-add-import - JHipster will add getters and setters here, do not remove

/**
 * REST controller for managing {@link com.aidriveall.cms.domain.CompanyUser}.
 */
@RestController
@RequestMapping("/api")
public class CompanyUserResource {

    private final Logger log = LoggerFactory.getLogger(CompanyUserResource.class);

    private static final String ENTITY_NAME = "companyCompanyUser";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final CompanyUserService companyUserService;

    private final CompanyUserQueryService companyUserQueryService;

    public CompanyUserResource(CompanyUserService companyUserService, CompanyUserQueryService companyUserQueryService) {
        this.companyUserService = companyUserService;
        this.companyUserQueryService = companyUserQueryService;
    }

    /**
     * {@code POST  /company-users} : Create a new companyUser.
     *
     * @param companyUserDTO the companyUserDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new companyUserDTO, or with status {@code 400 (Bad Request)} if the companyUser has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/company-users")
    public ResponseEntity<CompanyUserDTO> createCompanyUser(@RequestBody CompanyUserDTO companyUserDTO) throws URISyntaxException {
        log.debug("REST request to save CompanyUser : {}", companyUserDTO);
        if (companyUserDTO.getId() != null) {
            throw new BadRequestAlertException("A new companyUser cannot already have an ID", ENTITY_NAME, "idexists");
        }
        CompanyUserDTO result = companyUserService.save(companyUserDTO);
        return ResponseEntity.created(new URI("/api/company-users/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /company-users} : Updates an existing companyUser.
     *
     * @param companyUserDTO the companyUserDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated companyUserDTO,
     * or with status {@code 400 (Bad Request)} if the companyUserDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the companyUserDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/company-users")
    public ResponseEntity<CompanyUserDTO> updateCompanyUser(@RequestBody CompanyUserDTO companyUserDTO) throws URISyntaxException {
        log.debug("REST request to update CompanyUser : {}", companyUserDTO);
        if (companyUserDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        CompanyUserDTO result = companyUserService.save(companyUserDTO);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, companyUserDTO.getId().toString()))
            .body(result);
    }
    /**
     * {@code GET  /company-users} : get all the companyUsers.
     *

     * @param pageable the pagination information.
     * @param criteria the criteria which the requested entities should match.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of companyUsers in body.
     */
    @GetMapping("/company-users")
    public ResponseEntity<List<CompanyUserDTO>> getAllCompanyUsers(CompanyUserCriteria criteria, Pageable pageable, @RequestParam(value = "listModelName", required = false) String listModelName) {
        log.debug("REST request to get CompanyUsers by criteria: {}", criteria);
        Page<CompanyUserDTO> page;
        if (listModelName != null) {
            page = companyUserQueryService.selectByCustomEntity(listModelName, criteria,null, pageable);
        } else {
            page = companyUserQueryService.findByCriteria(criteria, pageable);
        }
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
    * {@code GET  /company-users/count} : count all the companyUsers.
    *
    * @param criteria the criteria which the requested entities should match.
    * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the count in body.
    */
    @GetMapping("/company-users/count")
    public ResponseEntity<Long> countCompanyUsers(CompanyUserCriteria criteria) {
        log.debug("REST request to count CompanyUsers by criteria: {}", criteria);
        return ResponseEntity.ok().body(companyUserQueryService.countByCriteria(criteria));
    }


    /**
     * {@code GET  /company-users/:id} : get the "id" companyUser.
     *
     * @param id the id of the companyUserDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the companyUserDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/company-users/{id}")

    public ResponseEntity<CompanyUserDTO> getCompanyUser(@PathVariable Long id) {
        log.debug("REST request to get CompanyUser : {}", id);
        Optional<CompanyUserDTO> companyUserDTO = companyUserService.findOne(id);
        return ResponseUtil.wrapOrNotFound(companyUserDTO);
    }
    /**
     * GET  /company-users/export : export the companyUsers.
     *
     *
     * @return the ResponseEntity with status 200 (OK) and with body the companyUserDTO, or with status 404 (Not Found)
     */
    @GetMapping("/company-users/export")
    public ResponseEntity<Void> exportToExcel() throws IOException {
        Page<CompanyUserDTO> page = companyUserService.findAll(Pageable.unpaged());
        Workbook workbook = ExcelExportUtil.exportExcel(new ExportParams("计算机一班学生","学生"),
            CompanyUserDTO.class, page.getContent());
        File savefile = new File("export");
        if (!savefile.exists()) {
            savefile.mkdirs();
        }
        FileOutputStream fos = new FileOutputStream("export/personDTO_2018_09_10.xls");
        workbook.write(fos);
        fos.close();
        return ResponseEntity.ok().build();
    }

    /**
     * POST  /company-users/import : import the companyUsers from excel file.
     *
     *
     * @return the ResponseEntity with status 200 (OK) and with body the companyUserDTO, or with status 404 (Not Found)
     */
    @PostMapping("/company-users/import")
    public ResponseEntity<Void> exportToExcel(MultipartFile file) throws IOException {
        String fileRealName = file.getOriginalFilename();//获得原始文件名;
        int pointIndex =  fileRealName.lastIndexOf(".");//点号的位置
        String fileSuffix = fileRealName.substring(pointIndex);//截取文件后缀
        String fileNewName = UUID.randomUUID().toString();//文件new名称时间戳
        String saveFileName = fileNewName.concat(fileSuffix);//文件存取名
        String filePath  = "import" ;
        File path = new File(filePath); //判断文件路径下的文件夹是否存在，不存在则创建
        if (!path.exists()) {
            path.mkdirs();
        }
        File savedFile = new File(filePath,saveFileName);
        file.transferTo(savedFile);
        ImportParams params = new ImportParams();
        params.setTitleRows(1);
        params.setHeadRows(1);
        List<CompanyUserDTO> list = ExcelImportUtil.importExcel(savedFile, CompanyUserDTO.class, params);
        list.forEach(companyUserService::save);
        return ResponseEntity.ok().build();
    }

    /**
     * {@code DELETE  /company-users/:id} : delete the "id" companyUser.
     *
     * @param id the id of the companyUserDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/company-users/{id}")
    public ResponseEntity<Void> deleteCompanyUser(@PathVariable Long id) {
        log.debug("REST request to delete CompanyUser : {}", id);
        companyUserService.delete(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString())).build();
    }

    /**
    * {@code DELETE  /company-users} : delete all the "ids" CompanyUsers.
    *
    * @param ids the ids of the articleDTO to delete.
    * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
    */
    @DeleteMapping("/company-users")
    public ResponseEntity<Void> deleteCompanyUsersByIds(@RequestParam("ids") ArrayList<Long> ids) {
        log.debug("REST request to delete CompanyUsers : {}", ids);
        if (ids != null) {
            ids.forEach(companyUserService::delete);
        }
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, (ids != null ? ids.toString() : "NoIds"))).build();
    }

    @GetMapping("/company-users/user/current-user")
    public ResponseEntity<List<CompanyUserDTO>> findByUserIsCurrentUser() {
        log.debug("REST request to get CompanyUser for current user. ");
        List<CompanyUserDTO> result = companyUserService.findByUserIsCurrentUser();
        return ResponseEntity.ok(result);
    }

    /**
     * {@code PUT  /company-users/specified-fields} : Updates an existing companyUser by specified fields.
     *
     * @param companyUserDTOAndSpecifiedFields the companyUserDTO and specifiedFields to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated companyUserDTO,
     * or with status {@code 400 (Bad Request)} if the companyUserDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the companyUserDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/company-users/specified-fields")
    public ResponseEntity<CompanyUserDTO> updateCompanyUserBySpecifiedFields(@RequestBody CompanyUserDTOAndSpecifiedFields companyUserDTOAndSpecifiedFields) throws URISyntaxException {
        log.debug("REST request to update CompanyUser : {}", companyUserDTOAndSpecifiedFields);
        CompanyUserDTO companyUserDTO = companyUserDTOAndSpecifiedFields.getCompanyUser();
        Set<String> specifiedFields = companyUserDTOAndSpecifiedFields.getSpecifiedFields();
        if (companyUserDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        CompanyUserDTO result = companyUserService.updateBySpecifiedFields(companyUserDTO,specifiedFields);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, companyUserDTO.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /company-users/specified-field} : Updates an existing companyUser by specified field.
     *
     * @param companyUserDTOAndSpecifiedFields the companyUserDTO and specifiedFields to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated companyUserDTO,
     * or with status {@code 400 (Bad Request)} if the companyUserDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the companyUserDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/company-users/specified-field")
    public ResponseEntity<CompanyUserDTO> updateCompanyUserBySpecifiedField(@RequestBody CompanyUserDTOAndSpecifiedFields companyUserDTOAndSpecifiedFields, CompanyUserCriteria criteria) throws URISyntaxException {
        log.debug("REST request to update CompanyUser : {}", companyUserDTOAndSpecifiedFields);
        CompanyUserDTO companyUserDTO = companyUserDTOAndSpecifiedFields.getCompanyUser();
        String fieldName = companyUserDTOAndSpecifiedFields.getSpecifiedField();
        if (companyUserDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        CompanyUserDTO result = companyUserService.updateBySpecifiedField(companyUserDTO, fieldName);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }
    // jhipster-needle-rest-resource-add-api - JHipster will add getters and setters here, do not remove

    private static class CompanyUserDTOAndSpecifiedFields {
        private CompanyUserDTO companyUser;
        private Set<String> specifiedFields;
        private String specifiedField;

        private CompanyUserDTO getCompanyUser() {
            return companyUser;
        }

        private void setCompanyUser(CompanyUserDTO companyUser) {
            this.companyUser = companyUser;
        }

        private Set<String> getSpecifiedFields() {
            return specifiedFields;
        }

        private void setSpecifiedFields(Set<String> specifiedFields) {
            this.specifiedFields = specifiedFields;
        }

        public String getSpecifiedField() {
            return specifiedField;
        }

        public void setSpecifiedField(String specifiedField) {
            this.specifiedField = specifiedField;
        }
    }
}
