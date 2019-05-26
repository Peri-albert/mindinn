import Resource from '../lib/resource'
import Service from './service'
import _ from '../lib/mptool';

class BlogCommentService extends Service {
	constructor() {
		super();
	}

	reset() {
		super.reset();
	}

	async getComments(blogId, count=10) {
		let resource = 'blog.blog_comments';
		let pageinfo = this.getPageInfo(resource, count);
		
		if (!pageinfo.hasNext) {
			return [];
		}

		let data = await Resource.get({
			service: 'honeycomb',
			resource: resource,
			data: {
				_p_from: pageinfo.nextFromId,
				_p_count: pageinfo.countPerPage,
				blog_id: blogId
			}
		})
		
		this.updatePageInfo(resource, data.pageinfo);
		let newComments = this.getCache(resource).addAll(data.comments);
		return newComments;
	}

	async commentBlog(blogId, content, atUserId, params) {
		wx.showLoading({
			title: '发布评论',
			mask: true
		})

		return new Promise((res, rej) => {
			setTimeout(() => {
				res({
					isSuccess: true
				})
				wx.hideLoading()
			}, Math.random() * 1000)
		})
		
	}

	async deleteComment(commentId) {
		wx.showLoading({
			title: '删除评论',
			mask: true
		})

		try {
			Resource.delete({
				service: 'honeycomb',
				resource: 'blog.blog_comment',
				data: {
					comment_id: commentId,
				}
			})

			return true;
		} catch(e) {
			wx.showToast({
				title: '删除评论失败，请稍后再试',
				icon: 'none',
				duration: 1500
			})
			return false;
		} finally {
			wx.hideLoading();
		}
	}

	async getUserComments(userId, count=10) {
		let resource = 'blog.user_blog_comments';
		let pageinfo = this.getPageInfo(resource, count);
		
		if (!pageinfo.hasNext) {
			return [];
		}

		let data = await Resource.get({
			service: 'honeycomb',
			resource: resource,
			data: {
				_p_from: pageinfo.nextFromId,
				_p_count: pageinfo.countPerPage,
				user_id: userId,
			}
		})
		
		this.updatePageInfo(resource, data.pageinfo);
		 let newComments = this.getCache(resource).addAll(data.comments);
		return newComments;
	}

	async likeComment(id) {
		let data = await Resource.put({
			service: 'honeycomb',
			resource: 'blog.liked_blog_comment',
			data: {
				'id': id,
			}
		})
		return data;
	}

	async unlikeComment(id) {
		let data = await Resource.delete({
			service: 'honeycomb',
			resource: 'blog.liked_blog_comment',
			data: {
				'id': id,
			}
		})
		return data;
	}
}

let service = new BlogCommentService();

export default service;