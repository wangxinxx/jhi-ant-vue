<template>
    <div class="row justify-content-center">
        <div class="col-8">
            <div v-if="uploadImage">
                <h2 class="jh-entity-heading"><span v-text="$t('jhiAntVueApp.filesUploadImage.detail.title')">UploadImage</span> {{uploadImage.id}}</h2>
                <dl class="row jh-entity-details">
                    <dt>
                        <span v-text="$t('jhiAntVueApp.filesUploadImage.fullName')">Full Name</span>
                    </dt>
                    <dd>
                        <span>{{uploadImage.fullName}}</span>
                    </dd>
                    <dt>
                        <span v-text="$t('jhiAntVueApp.filesUploadImage.name')">Name</span>
                    </dt>
                    <dd>
                        <span>{{uploadImage.name}}</span>
                    </dd>
                    <dt>
                        <span v-text="$t('jhiAntVueApp.filesUploadImage.ext')">Ext</span>
                    </dt>
                    <dd>
                        <span>{{uploadImage.ext}}</span>
                    </dd>
                    <dt>
                        <span v-text="$t('jhiAntVueApp.filesUploadImage.type')">Type</span>
                    </dt>
                    <dd>
                        <span>{{uploadImage.type}}</span>
                    </dd>
                    <dt>
                        <span v-text="$t('jhiAntVueApp.filesUploadImage.url')">Url</span>
                    </dt>
                    <dd>
                        <span>{{uploadImage.url}}</span>
                    </dd>
                    <dt>
                        <span v-text="$t('jhiAntVueApp.filesUploadImage.path')">Path</span>
                    </dt>
                    <dd>
                        <span>{{uploadImage.path}}</span>
                    </dd>
                    <dt>
                        <span v-text="$t('jhiAntVueApp.filesUploadImage.folder')">Folder</span>
                    </dt>
                    <dd>
                        <span>{{uploadImage.folder}}</span>
                    </dd>
                    <dt>
                        <span v-text="$t('jhiAntVueApp.filesUploadImage.entityName')">Entity Name</span>
                    </dt>
                    <dd>
                        <span>{{uploadImage.entityName}}</span>
                    </dd>
                    <dt>
                        <span v-text="$t('jhiAntVueApp.filesUploadImage.createAt')">Create At</span>
                    </dt>
                    <dd>
                        <span v-if="uploadImage.createAt">{{$d(Date.parse(uploadImage.createAt), 'long') }}</span>
                    </dd>
                    <dt>
                        <span v-text="$t('jhiAntVueApp.filesUploadImage.fileSize')">File Size</span>
                    </dt>
                    <dd>
                        <span>{{uploadImage.fileSize}}</span>
                    </dd>
                    <dt>
                        <span v-text="$t('jhiAntVueApp.filesUploadImage.smartUrl')">Smart Url</span>
                    </dt>
                    <dd>
                        <span>{{uploadImage.smartUrl}}</span>
                    </dd>
                    <dt>
                        <span v-text="$t('jhiAntVueApp.filesUploadImage.mediumUrl')">Medium Url</span>
                    </dt>
                    <dd>
                        <span>{{uploadImage.mediumUrl}}</span>
                    </dd>
                    <dt>
                        <span v-text="$t('jhiAntVueApp.filesUploadImage.referenceCount')">Reference Count</span>
                    </dt>
                    <dd>
                        <span>{{uploadImage.referenceCount}}</span>
                    </dd>
                    <dt>
                        <span v-text="$t('jhiAntVueApp.filesUploadImage.user')">上传者</span>
                    </dt>
                    <dd>
                        {{uploadImage.userLogin}}
                    </dd>
                </dl>
                <button type="submit"
                        v-on:click.prevent="previousState()"
                        class="btn btn-info">
                    <font-awesome-icon icon="arrow-left"></font-awesome-icon>&nbsp;<span v-text="$t('entity.action.back')"> Back</span>
                </button>
                <router-link v-if="uploadImage.id" :to="{name: 'UploadImageEdit', params: {uploadImageId: uploadImage.id}}" tag="button" class="btn btn-primary">
                    <font-awesome-icon icon="pencil-alt"></font-awesome-icon>&nbsp;<span v-text="$t('entity.action.edit')"> Edit</span>
                </router-link>
            </div>
        </div>
    </div>
</template>

<script lang="ts" src="./upload-image-details.component.ts">
</script>
