import request from '@/utils/requestNew'
let BASE_Prefix = '/common-service'
export function oss_uploadfileparam(e,filetype,type,noLoading = false,files) { //oss 上传
    let formData = new FormData()
    if(files){
        formData.append('file', files[0])
    }else {
        formData.append('file', e.target.files[0])
    }
    return request({
        url: BASE_Prefix + '/oss/uploadfileparam?filetype=' + filetype + '&type=' + type,
        method: 'post',
        header: {
            noLoading: noLoading
        },
        data: formData
    })
}