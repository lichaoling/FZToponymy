import { Upload, Icon, Spin, Button, Modal } from 'antd';
import { Post } from '../../../utils/request.js';
import st from './UploadFile.less';

class UploadFile extends React.Component {
  constructor(ps) {
    super(ps);

    let files = this.getFilePaths(ps.fileList);

    this.state.fileList = files;
  }
  state = {
    showLoading: false,
  };

  componentWillReceiveProps(ps) {
    let files = ps.fileList;
    if (files) {
      this.setState({ fileList: this.getFilePaths(files) });
    }
  }

  getFilePaths(files) {
    const { fileBasePath } = this.props;
    return (files || []).map(e => {
      return {
        uid: e.FileID,
        name: e.FileName,
        url: `${fileBasePath}/${e.RelativePath}`,
      };
    });
  }

  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = file => {
    this.setState({
      previewImage: file.previewUrl || file.url,
      previewVisible: true,
    });
  };

  async getPictures() {
    const { getAction, id, data } = this.props;
    await Post(getAction, { id: id, ...data }, d => {
      let files = this.getFilePaths(d);
      this.setState({ fileList: files });
    });
  }

  async onRemove(file) {
    Modal.confirm({
      title: '提醒',
      content: '确定删除？',
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        const { removeAction, data } = this.props;
        const { uid } = file;
        this.setState({ showLoading: true });
        await Post(removeAction, { id: uid, ...data }, d => {
          this.getPictures();
        });
        this.setState({ showLoading: false });
      },
      onCancel() {},
    });
  }

  beforeUpload = file => {
    const { uploadAction } = this.props;
    const { id, data } = this.props;

    // 构造Form数据
    var formData = new FormData();
    var datas = { id: id, ...data };

    for (let i in datas) {
      formData.append(i, datas[i]);
    }

    formData.append('file', file);
    this.setState({ showLoading: true });
    $.ajax({
      url: uploadAction,
      type: 'POST',
      data: formData,
      processData: false,
      contentType: false,
      success: res => {
        this.getPictures();
        this.setState({ showLoading: false });
      },
      error: res => {
        alert('上传失败！');
        this.setState({ showLoading: false });
      },
    });
    return false;
  };

  render() {
    const { showLoading, fileList } = this.state;
    return (
      <div className={`${st.uploadfile} clearfix`}>
        <Upload
          disabled={showLoading || this.props.disabled}
          listType="text"
          fileList={fileList}
          beforeUpload={this.beforeUpload}
          onRemove={this.props.disabled ? false : this.onRemove.bind(this)}
        >
          <Button>
            <Icon type="plus" />
            <div className="ant-upload-text">上传</div>
            {/* <Icon type="upload" /> 上传 */}
          </Button>
        </Upload>
      </div>
    );
  }
}

export default UploadFile;
