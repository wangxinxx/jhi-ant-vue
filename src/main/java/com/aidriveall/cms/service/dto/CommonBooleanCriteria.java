package com.aidriveall.cms.service.dto;

import java.io.Serializable;
import java.util.Objects;
import io.github.jhipster.service.Criteria;
import io.github.jhipster.service.filter.BooleanFilter;
import io.github.jhipster.service.filter.DoubleFilter;
import io.github.jhipster.service.filter.Filter;
import io.github.jhipster.service.filter.FloatFilter;
import io.github.jhipster.service.filter.IntegerFilter;
import io.github.jhipster.service.filter.LongFilter;
import io.github.jhipster.service.filter.StringFilter;

/**
 * Criteria class for the {@link com.aidriveall.cms.domain.CommonBoolean} entity. This class is used
 * in {@link com.aidriveall.cms.web.rest.CommonBooleanResource} to receive all the possible filtering options from
 * the Http GET request parameters.
 * For example the following could be a valid request:
 * {@code /common-booleans?id.greaterThan=5&attr1.contains=something&attr2.specified=false}
 * As Spring is unable to properly convert the types, unless specific {@link Filter} class are used, we need to use
 * fix type specific filters.
 */
public class CommonBooleanCriteria implements Serializable, Criteria {
    private String jhiCommonSearchKeywords;

    private static final long serialVersionUID = 1L;

    private LongFilter id;

    private BooleanFilter value;

    public CommonBooleanCriteria(){
    }

    public CommonBooleanCriteria(CommonBooleanCriteria other){
        this.id = other.id == null ? null : other.id.copy();
        this.value = other.value == null ? null : other.value.copy();
    }

    @Override
    public CommonBooleanCriteria copy() {
        return new CommonBooleanCriteria(this);
    }

    public LongFilter getId() {
        return id;
    }

    public void setId(LongFilter id) {
        this.id = id;
    }

    public BooleanFilter getValue() {
        return value;
    }

    public void setValue(BooleanFilter value) {
        this.value = value;
    }

    public String getJhiCommonSearchKeywords() {
        return jhiCommonSearchKeywords;
    }

    public void setJhiCommonSearchKeywords(String jhiCommonSearchKeywords) {
        this.jhiCommonSearchKeywords = jhiCommonSearchKeywords;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        final CommonBooleanCriteria that = (CommonBooleanCriteria) o;
        return
            Objects.equals(id, that.id) &&
            Objects.equals(value, that.value);
    }

    @Override
    public int hashCode() {
        return Objects.hash(
        id,
        value
        );
    }

    @Override
    public String toString() {
        return "CommonBooleanCriteria{" +
                (id != null ? "id=" + id + ", " : "") +
                (value != null ? "value=" + value + ", " : "") +
            "}";
    }

}
