import React, { useState, useEffect } from "react";
import {
  Card,
  Row,
  Col,
  Statistic,
  Table,
  DatePicker,
  Select,
  Typography,
  Space,
  Button,
  Tooltip,
  Progress,
  Avatar,
  Badge,
  List,
  Tag,
} from "antd";
import {
  EyeOutlined,
  HeartOutlined,
  ShareAltOutlined,
  CommentOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  ReloadOutlined,
  UserOutlined,
  FileTextOutlined,
  FolderOutlined,
  TeamOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
} from "firebase/firestore";
import { db } from "../../database/db";
import { format, subDays, compareAsc } from "date-fns";
import { vi } from "date-fns/locale";
import dayjs from "dayjs";

const { RangePicker } = DatePicker;
const { Option } = Select;
const { Title, Text } = Typography;

const Dashboard = () => {
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState([
    dayjs().subtract(30, "day"),
    dayjs(),
  ]);
  const [stats, setStats] = useState({
    totalPosts: 0,
    totalViews: 0,
    totalLikes: 0,
    totalShares: 0,
    totalComments: 0,
    totalUsers: 0,
    totalCategories: 0,
    viewsChange: 0,
    likesChange: 0,
    sharesChange: 0,
    commentsChange: 0,
    recentPosts: [],
    popularPosts: [],
    recentUsers: [],
    recentComments: [],
  });

  useEffect(() => {
    fetchStats();
  }, [dateRange]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const [startDate, endDate] = dateRange;

      // Convert dayjs to Date for Firestore queries
      const startDateObj = startDate.toDate();
      const endDateObj = endDate.toDate();

      // Fetch posts
      const postsRef = collection(db, "blogs");
      const postsQuery = query(
        postsRef,
        where("publish_date", ">=", startDateObj),
        where("publish_date", "<=", endDateObj),
        orderBy("publish_date", "desc")
      );
      const postsSnapshot = await getDocs(postsQuery);
      const postsData = postsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Fetch users
      const usersRef = collection(db, "users");
      const usersSnapshot = await getDocs(usersRef);
      const usersData = usersSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Fetch categories
      const categoriesRef = collection(db, "categories");
      const categoriesSnapshot = await getDocs(categoriesRef);
      const categoriesData = categoriesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Calculate total stats
      const totalViews = postsData.reduce(
        (sum, post) => sum + (post.view_count || 0),
        0
      );
      const totalLikes = postsData.reduce(
        (sum, post) => sum + (post.like_count || 0),
        0
      );
      const totalShares = postsData.reduce(
        (sum, post) => sum + (post.share_count || 0),
        0
      );
      const totalComments = postsData.reduce(
        (sum, post) => sum + (post.comment_count || 0),
        0
      );

      // Calculate changes from previous period
      const previousStartDate = subDays(
        startDateObj,
        compareAsc(endDateObj, startDateObj)
      );
      const previousEndDate = subDays(startDateObj, 1);
      const previousPostsQuery = query(
        postsRef,
        where("publish_date", ">=", previousStartDate),
        where("publish_date", "<=", previousEndDate),
        orderBy("publish_date", "desc")
      );
      const previousPostsSnapshot = await getDocs(previousPostsQuery);
      const previousPostsData = previousPostsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const previousTotalViews = previousPostsData.reduce(
        (sum, post) => sum + (post.view_count || 0),
        0
      );
      const previousTotalLikes = previousPostsData.reduce(
        (sum, post) => sum + (post.like_count || 0),
        0
      );
      const previousTotalShares = previousPostsData.reduce(
        (sum, post) => sum + (post.share_count || 0),
        0
      );
      const previousTotalComments = previousPostsData.reduce(
        (sum, post) => sum + (post.comment_count || 0),
        0
      );

      const viewsChange = previousTotalViews
        ? ((totalViews - previousTotalViews) / previousTotalViews) * 100
        : 0;
      const likesChange = previousTotalLikes
        ? ((totalLikes - previousTotalLikes) / previousTotalLikes) * 100
        : 0;
      const sharesChange = previousTotalShares
        ? ((totalShares - previousTotalShares) / previousTotalShares) * 100
        : 0;
      const commentsChange = previousTotalComments
        ? ((totalComments - previousTotalComments) / previousTotalComments) *
          100
        : 0;

      // Get recent and popular posts
      const recentPosts = [...postsData].slice(0, 5);
      const popularPosts = [...postsData]
        .sort((a, b) => (b.view_count || 0) - (a.view_count || 0))
        .slice(0, 5);

      // Get recent users
      const recentUsers = [...usersData]
        .sort(
          (a, b) =>
            (b.created_at?.toDate() || 0) - (a.created_at?.toDate() || 0)
        )
        .slice(0, 5);

      setStats({
        totalPosts: postsData.length,
        totalViews,
        totalLikes,
        totalShares,
        totalComments,
        totalUsers: usersData.length,
        totalCategories: categoriesData.length,
        viewsChange,
        likesChange,
        sharesChange,
        commentsChange,
        recentPosts,
        popularPosts,
        recentUsers,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "published":
        return "green";
      case "draft":
        return "orange";
      case "pending":
        return "blue";
      default:
        return "default";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "published":
        return "Đã xuất bản";
      case "draft":
        return "Bản nháp";
      case "pending":
        return "Đang chờ";
      default:
        return status;
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <Title level={2}>Bảng điều khiển</Title>
        <Space>
          <RangePicker
            value={dateRange}
            onChange={(dates) => setDateRange(dates)}
            format="DD/MM/YYYY"
          />
          <Button
            icon={<ReloadOutlined />}
            onClick={fetchStats}
            loading={loading}
          />
        </Space>
      </div>

      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Tổng số bài viết"
              value={stats.totalPosts}
              prefix={<FileTextOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Tổng số người dùng"
              value={stats.totalUsers}
              prefix={<TeamOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Tổng số danh mục"
              value={stats.totalCategories}
              prefix={<FolderOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Lượt xem"
              value={stats.totalViews}
              prefix={<EyeOutlined />}
              suffix={
                <Tooltip title="So với kỳ trước">
                  <span
                    className={
                      stats.viewsChange >= 0 ? "text-green-500" : "text-red-500"
                    }
                  >
                    {stats.viewsChange >= 0 ? (
                      <ArrowUpOutlined />
                    ) : (
                      <ArrowDownOutlined />
                    )}
                    {Math.abs(stats.viewsChange).toFixed(1)}%
                  </span>
                </Tooltip>
              }
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} md={12}>
          <Card title="Bài viết gần đây">
            <List
              dataSource={stats.recentPosts}
              renderItem={(post) => (
                <List.Item
                  actions={[
                    <Tag color={getStatusColor(post.status)}>
                      {getStatusText(post.status)}
                    </Tag>,
                    <Text type="secondary">
                      {post.publish_date?.toDate
                        ? format(post.publish_date.toDate(), "dd/MM/yyyy", {
                            locale: vi,
                          })
                        : "N/A"}
                    </Text>,
                  ]}
                >
                  <List.Item.Meta
                    avatar={
                      <Avatar
                        src={post.thumbnail_image}
                        icon={<FileTextOutlined />}
                      />
                    }
                    title={<a href={`/blog/${post.slug}`}>{post.title}</a>}
                    description={post.author}
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card title="Bài viết phổ biến">
            <List
              dataSource={stats.popularPosts}
              renderItem={(post) => (
                <List.Item
                  actions={[
                    <Space>
                      <EyeOutlined /> {post.view_count || 0}
                      <HeartOutlined /> {post.like_count || 0}
                    </Space>,
                  ]}
                >
                  <List.Item.Meta
                    avatar={
                      <Avatar
                        src={post.thumbnail_image}
                        icon={<FileTextOutlined />}
                      />
                    }
                    title={<a href={`/blog/${post.slug}`}>{post.title}</a>}
                    description={post.author}
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <Card title="Người dùng mới">
            <List
              dataSource={stats.recentUsers}
              renderItem={(user) => (
                <List.Item
                  actions={[
                    <Tag color={user.role === "admin" ? "red" : "blue"}>
                      {user.role === "admin" ? "Quản trị viên" : "Người dùng"}
                    </Tag>,
                  ]}
                >
                  <List.Item.Meta
                    avatar={
                      <Avatar src={user.avatar} icon={<UserOutlined />} />
                    }
                    title={user.name}
                    description={user.email}
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card title="Thống kê tương tác">
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Card size="small">
                  <Statistic
                    title="Lượt thích"
                    value={stats.totalLikes}
                    prefix={<HeartOutlined />}
                    suffix={
                      <Tooltip title="So với kỳ trước">
                        <span
                          className={
                            stats.likesChange >= 0
                              ? "text-green-500"
                              : "text-red-500"
                          }
                        >
                          {stats.likesChange >= 0 ? (
                            <ArrowUpOutlined />
                          ) : (
                            <ArrowDownOutlined />
                          )}
                          {Math.abs(stats.likesChange).toFixed(1)}%
                        </span>
                      </Tooltip>
                    }
                  />
                </Card>
              </Col>
              <Col span={12}>
                <Card size="small">
                  <Statistic
                    title="Lượt chia sẻ"
                    value={stats.totalShares}
                    prefix={<ShareAltOutlined />}
                    suffix={
                      <Tooltip title="So với kỳ trước">
                        <span
                          className={
                            stats.sharesChange >= 0
                              ? "text-green-500"
                              : "text-red-500"
                          }
                        >
                          {stats.sharesChange >= 0 ? (
                            <ArrowUpOutlined />
                          ) : (
                            <ArrowDownOutlined />
                          )}
                          {Math.abs(stats.sharesChange).toFixed(1)}%
                        </span>
                      </Tooltip>
                    }
                  />
                </Card>
              </Col>
              <Col span={12}>
                <Card size="small">
                  <Statistic
                    title="Bình luận"
                    value={stats.totalComments}
                    prefix={<CommentOutlined />}
                    suffix={
                      <Tooltip title="So với kỳ trước">
                        <span
                          className={
                            stats.commentsChange >= 0
                              ? "text-green-500"
                              : "text-red-500"
                          }
                        >
                          {stats.commentsChange >= 0 ? (
                            <ArrowUpOutlined />
                          ) : (
                            <ArrowDownOutlined />
                          )}
                          {Math.abs(stats.commentsChange).toFixed(1)}%
                        </span>
                      </Tooltip>
                    }
                  />
                </Card>
              </Col>
              <Col span={12}>
                <Card size="small">
                  <Statistic
                    title="Tỷ lệ tương tác"
                    value={
                      stats.totalPosts
                        ? (
                            (stats.totalLikes +
                              stats.totalComments +
                              stats.totalShares) /
                            stats.totalPosts
                          ).toFixed(1)
                        : 0
                    }
                    suffix="tương tác/bài viết"
                  />
                </Card>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
