<template>
  <v-app id="inspire">
    <!-- Thanh tiêu đề -->
    <v-app-bar app color="blue" dark>
      <v-app-bar-nav-icon @click.stop="mini = !mini" />
      <v-toolbar-title style="width: 300px;" class="ml-0 pl-4">
        <span class="hidden-sm-and-down">ADMIN PAGE</span>
      </v-toolbar-title>
      <v-spacer />
      <v-btn icon>
        <v-icon>mdi-logout</v-icon>
      </v-btn>
    </v-app-bar>

    <!-- Nội dung chính -->
    <v-main>
      <v-container class="scroll-y" fluid>
        <v-row align="center" justify="center">
          <v-col cols="16" md="8">
            <v-card class="ml-5 mr-5">
              <!-- Header -->
              <v-app-bar dark color="#2C3A47">
                <v-btn icon>
                  <v-icon>local_offer</v-icon>
                </v-btn>
                <v-toolbar-title>CƠ SỞ DỮ LIỆU</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-dialog v-model="dialog" persistent max-width="800px">
                  <template v-slot:activator="{ on }">
                    <v-btn color="red" v-on="on" outlined>
                      <v-icon left>add</v-icon>THÊM
                    </v-btn>
                  </template>

                  <!-- Form nhập/sửa -->
                  <v-card>
                    <v-card-title>
                      <span class="headline">
                        {{ editedIndex === -1 ? 'Thêm cây thuốc' : `Chỉnh sửa thông tin cây ${postData.name}` }}
                      </span>
                    </v-card-title>

                    <v-card-text>
                      <v-container>
                      <div class="mb-4">
                        <v-row align="center" justify="center">
                          <!-- Bên trái: Ảnh hiện tại hoặc icon -->
                          <v-col cols="12" md="6" class="text-center">
                            <p class="font-weight-bold">
                              {{ editedIndex === -1 ? 'Chọn hình ảnh' : 'Hình ảnh hiện tại' }}
                            </p>
                            <template v-if="selectedImage">
                              <v-img
                                :src="imagePreview"
                                max-width="150"
                                max-height="150"
                                contain
                                class="mx-auto"
                              ></v-img>
                            </template>

                            <template v-else-if="postData.image">
                              <v-img
                                :src="`http://localhost:4000/uploads/${postData.image}`"
                                max-width="150"
                                max-height="150"
                                contain
                                class="mx-auto"
                              ></v-img>
                            </template>

                            <template v-else>
                              <div class="d-flex justify-center align-center" style="height: 150px;">
                                <v-icon size="64" color="grey">mdi-image</v-icon>
                              </div>
                            </template>
                          </v-col>


                          <!-- Bên phải: nút chọn hình -->
                          <v-col cols="12" md="6" class="text-center">
                            <input
                              ref="fileInput"
                              type="file"
                              accept="image/*"
                              @change="onFileSelected"
                              style="display: none;"
                            />
                            <v-btn color="#2C3A47" small dark class="mt-2" @click="$refs.fileInput.click()">
                              <v-icon left>mdi-camera</v-icon>
                              Chọn hình ảnh mới
                            </v-btn>
                          </v-col>
                        </v-row>
                      </div>


                        <!-- Hai cột: Tên và Tên khoa học -->
                        <v-row>
                          <v-col cols="12" md="6">
                            <v-text-field label="Tên" v-model="postData.name" color="#2C3A47" />
                          </v-col>
                          <v-col cols="12" md="6">
                            <v-text-field label="Tên khoa học" v-model="postData.scientificName" color="#2C3A47" />
                          </v-col>
                        </v-row>

                        <!-- Mô tả -->
                        <v-textarea
                          label="Mô tả"
                          v-model="postData.description"
                          color="#2C3A47"
                          auto-grow
                        />

                        <!-- Thông tin dược liệu -->
                        <v-textarea
                          label="Thông tin"
                          v-model="postData.medicalInfo"
                          color="#2C3A47"
                          auto-grow
                        />
                      </v-container>
                    </v-card-text>

                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn color="blue" dark @click="savePost">Lưu thay đổi</v-btn>
                      <v-btn text @click="close">Đóng</v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-app-bar>

              <!-- Tìm kiếm -->
              <v-container>
                <v-card class="pa-4 mb-4" outlined>
                  <v-text-field
                    v-model="search"
                    append-icon="search"
                    label="Tìm kiếm"
                    single-line
                    hide-details
                    color="#2C3A47"
                  />
                </v-card >

                <!-- Danh sách card theo cột dọc -->
                <v-row>
                  <v-col
                    v-for="(item, index) in filteredPosts"
                    :key="index"
                    cols="12"
                  >
                    <v-card class="d-flex mb-4">
                      <!-- Ảnh -->
                      <v-img
                        :src="`http://localhost:4000/uploads/${item.image}`"
                        max-width="450"
                        max-height="450"
                        min-width="300"
                        min-height="300"
                        class="ma-3"
                        contain
                      ></v-img>

                      <!-- Nội dung -->
                      <v-card-text>
                        <h3 class="mb-1 font-weight-bold">{{ item.name }}</h3>
                        <p class="mb-1"><strong>Tên khoa học:</strong> {{ item.scientificName }}</p>
                        <!-- <p class="mb-1"><strong>Mô tả:</strong> {{ item.description }}</p>
                        <p class="mb-3"><strong>Thông tin dược liệu:</strong> {{ item.medicalInfo }}</p> -->

                        <p class="mb-1"><strong>Mô tả:</strong></p>
                        <p class="mb-3" v-html="formatText(item.description)"></p>

                        <p class="mb-1"><strong>Thông tin dược liệu:</strong></p>
                        <p class="mb-3" v-html="formatText(item.medicalInfo)"></p>



                        <v-btn color="green" small class="mr-2" @click="editPost(item)">
                          <v-icon left>mdi-pencil</v-icon>Sửa
                        </v-btn>
                        <v-btn color="red" small @click="deletePost(item)">
                          <v-icon left>mdi-delete</v-icon>Xóa
                        </v-btn>
                      </v-card-text>
                    </v-card>
                  </v-col>
                </v-row>
              </v-container>
            </v-card>

            <!-- Snackbar thông báo -->
            <v-snackbar v-model="snackbar" top right :color="color">
              {{ text }}
              <v-btn color="black" text @click="snackbar = false">Đóng</v-btn>
            </v-snackbar>
          </v-col>
        </v-row>
      </v-container>
    </v-main>

    <!-- Nút lên đầu trang -->
    <v-btn
      v-scroll="onscroll"
      bottom
      color="red"
      dark
      fab
      fixed
      right
      @click="toTop"
    >
      <v-icon>mdi-chevron-up</v-icon>
    </v-btn>
  </v-app>
</template>



<script>
import axios from 'axios'

export default {
  data: () => ({
    mini: false,
    dialog: false,
    fab: false,
    search: '',
    snackbar: false,
    text: '',
    color: '',
    posts: [],
    selectedImage: null,
    imagePreviewURL: null,
    postData: {
      name: '',
      scientificName: '',
      description: '',
      medicalInfo: '',
      image: null,
    },
    default: {
      name: '',
      scientificName: '',
      description: '',
      medicalInfo: '',
      image: null,
    },
    editedIndex: -1,
  }),

  computed: {
    saveDialog() {
      return this.editedIndex === -1 ? 'Save' : 'Edit';
    },

    filteredPosts() {
      return this.posts.filter(post => {
        const name = post.name?.toLowerCase() || '';
        const sci = post.scientificName?.toLowerCase() || '';
        const desc = post.description?.toLowerCase() || '';
        const med = post.medicalInfo?.toLowerCase() || '';
        const term = this.search.toLowerCase();
        return name.includes(term) || sci.includes(term) || desc.includes(term) || med.includes(term);
      });
    },

    imagePreview() {
      if (this.selectedImage) return this.imagePreviewURL;
      if (this.postData.image) return `http://localhost:4000/uploads/${this.postData.image}`;
      return null;
    },

  },

  watch: {
    dialog(val) {
      if (!val) this.close();
    },
  },

  mounted() {
    this.loadPosts();
  },

  methods: {
    loadPosts() {
      axios.get('http://localhost:4000/api').then(res => {
        this.posts = [...res.data];
      }).catch(error => console.log(error));
    },

    formatText(text) {
      if (!text) return '';
      // Thay thế xuống dòng bằng thẻ <br>
      return text.replace(/\n/g, '<br>');
    },

    onscroll(e) {
      if (typeof window === 'undefined') return;
      const top = window.pageYOffset || e.target.scrollTop || 0;
      this.fab = top > 20;
    },

    toTop() {
      this.$vuetify.goTo(0);
    },

    close() {
      this.dialog = false;
      setTimeout(() => {
        if (this.imagePreviewURL) window.URL.revokeObjectURL(this.imagePreviewURL);
        this.postData = { ...this.default };
        this.selectedImage = null;
        this.imagePreviewURL = null;
        this.editedIndex = -1;
      }, 300);
    },


    onFileSelected(event) {
      const file = event.target.files[0];
      if (file) {
        if (this.imagePreviewURL) window.URL.revokeObjectURL(this.imagePreviewURL);
        this.selectedImage = file;
        this.imagePreviewURL = window.URL.createObjectURL(file);
      }
    },


    savePost() {
      if (this.editedIndex > -1) {
        this.updatePost();
      } else {
        this.createPost();
      }
    },

    createPost() {
      const apiURL = 'http://localhost:4000/api/create-post';
      const formData = new FormData();
      formData.append('name', this.postData.name);
      formData.append('scientificName', this.postData.scientificName);
      formData.append('description', this.postData.description);
      formData.append('medicalInfo', this.postData.medicalInfo);
      formData.append('image', this.selectedImage);

      axios.post(apiURL, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(() => {
        this.close();
        this.color = 'success';
        this.text = 'Post đã được thêm thành công';
        this.snackbar = true;
        this.loadPosts();
      }).catch(error => console.log(error));
    },

    editPost(item) {
      this.editedIndex = this.posts.indexOf(item);
      this.postData = Object.assign({}, item);
      this.selectedImage = null;
      this.dialog = true;
    },

    updatePost() {
      const apiURL = `http://localhost:4000/api/update-post/${this.postData._id}`;
      const formData = new FormData();
      formData.append('name', this.postData.name);
      formData.append('scientificName', this.postData.scientificName);
      formData.append('description', this.postData.description);
      formData.append('medicalInfo', this.postData.medicalInfo);
      if (this.selectedImage) {
        formData.append('image', this.selectedImage);
      } else {
        formData.append('image', this.postData.image);
      }

      axios.post(apiURL, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      }).then(() => {
        this.close();
        this.color = 'info';
        this.text = 'Post đã được cập nhật';
        this.snackbar = true;
        this.loadPosts();
      }).catch(error => console.log(error));
    },

    deletePost(item) {
      const id = item._id;
      this.$swal({
        title: 'Bạn chắc chắn?',
        text: 'Bạn sẽ không thể hoàn tác lại thao tác này',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#00b894',
        cancelButtonColor: '#d63031',
        confirmButtonText: 'Đồng ý',
        cancelButtonText: 'Hủy'
      }).then((result) => {
        if (result.isConfirmed) {
          const apiURL = `http://localhost:4000/api/delete-post/${id}`;
          axios.delete(apiURL).then(() => {
            this.posts = this.posts.filter(post => post._id !== id);
            this.color = 'error';
            this.text = 'Đã xóa bài viết';
            this.snackbar = true;
          }).catch(error => console.log(error));
        }
      });
    }
  },

  beforeDestroy() {
    if (this.imagePreviewURL) window.URL.revokeObjectURL(this.imagePreviewURL);
  },

};
</script>