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
} from "antd";
import {
  EyeOutlined,
  HeartOutlined,
  ShareAltOutlined,
  CommentOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { db } from "../../database/db";
import { format, subDays, compareAsc } from "date-fns";
import { vi } from "date-fns/locale";

const { RangePicker } = DatePicker;
const { Option } = Select;
const { Title, Text } = Typography;

const Analytics = () => {
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState([
    subDays(new Date(), 30),
    new Date(),
  ]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [categories, setCategories] = useState([]);
  const [stats, setStats] = useState({
    totalViews: 0,
    totalLikes: 0,
    totalShares: 0,
    totalComments: 0,
    viewsChange: 0,
    likesChange: 0,
    sharesChange: 0,
    commentsChange: 0,
    topPosts: [],
  });

  useEffect(() => {
    fetchCategories();
    fetchStats();
  }, [dateRange, selectedCategory]);

  const fetchCategories = async () => {
    try {
      const categoriesRef = collection(db, "categories");
      const querySnapshot = await getDocs(categoriesRef);
      const categoriesData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCategories(categoriesData);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchStats = async () => {
    try {
      setLoading(true);
      const [startDate, endDate] = dateRange;
      const blogsRef = collection(db, "blogs");
      let q = query(
        blogsRef,
        where("publish_date", ">=", startDate),
        where("publish_date", "<=", endDate),
        orderBy("publish_date", "desc")
      );

      if (selectedCategory !== "all") {
        q = query(q, where("category", "==", selectedCategory));
      }

      const querySnapshot = await getDocs(q);
      const blogsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Calculate total stats
      const totalViews = blogsData.reduce(
        (sum, blog) => sum + (blog.view_count || 0),
        0
      );
      const totalLikes = blogsData.reduce(
        (sum, blog) => sum + (blog.like_count || 0),
        0
      );
      const totalShares = blogsData.reduce(
        (sum, blog) => sum + (blog.share_count || 0),
        0
      );
      const totalComments = blogsData.reduce(
        (sum, blog) => sum + (blog.comment_count || 0),
        0
      );

      // Calculate changes from previous period
      const previousStartDate = subDays(
        startDate,
        compareAsc(endDate, startDate)
      );
      const previousEndDate = subDays(startDate, 1);
      const previousQ = query(
        blogsRef,
        where("publish_date", ">=", previousStartDate),
        where("publish_date", "<=", previousEndDate),
        orderBy("publish_date", "desc")
      );
      const previousSnapshot = await getDocs(previousQ);
      const previousData = previousSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const previousTotalViews = previousData.reduce(
        (sum, blog) => sum + (blog.view_count || 0),
        0
      );
      const previousTotalLikes = previousData.reduce(
        (sum, blog) => sum + (blog.like_count || 0),
        0
      );
      const previousTotalShares = previousData.reduce(
        (sum, blog) => sum + (blog.share_count || 0),
        0
      );
      const previousTotalComments = previousData.reduce(
        (sum, blog) => sum + (blog.comment_count || 0),
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

      // Get top posts
      const topPosts = [...blogsData]
        .sort((a, b) => (b.view_count || 0) - (a.view_count || 0))
        .slice(0, 5);

      setStats({
        totalViews,
        totalLikes,
        totalShares,
        totalComments,
        viewsChange,
        likesChange,
        sharesChange,
        commentsChange,
        topPosts,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "Bài viết",
      dataIndex: "title",
      key: "title",
      width: "40%",
      render: (text, record) => (
        <div className="flex items-center space-x-3">
          <img
            src={record.thumbnail_image}
            alt={text}
            className="w-12 h-12 rounded-lg object-cover"
          />
          <div>
            <Text strong className="block">
              {text}
            </Text>
            <Text type="secondary" className="text-xs">
              {record.author}
            </Text>
          </div>
        </div>
      ),
    },
    {
      title: "Lượt xem",
      dataIndex: "view_count",
      key: "view_count",
      width: "15%",
      render: (count) => (
        <div className="flex items-center gap-2">
          <EyeOutlined className="text-blue-500" />
          <span>{count || 0}</span>
        </div>
      ),
    },
    {
      title: "Lượt thích",
      dataIndex: "like_count",
      key: "like_count",
      width: "15%",
      render: (count) => (
        <div className="flex items-center gap-2">
          <HeartOutlined className="text-red-500" />
          <span>{count || 0}</span>
        </div>
      ),
    },
    {
      title: "Tương tác",
      key: "interaction",
      width: "30%",
      render: (_, record) => (
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs">Lượt xem</span>
            <Progress
              percent={Math.min(
                (record.view_count / stats.totalViews) * 100,
                100
              )}
              size="small"
              showInfo={false}
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs">Lượt thích</span>
            <Progress
              percent={Math.min(
                (record.like_count / stats.totalLikes) * 100,
                100
              )}
              size="small"
              showInfo={false}
              status="exception"
            />
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <Title level={2}>Thống kê</Title>
        <Space>
          <Select
            value={selectedCategory}
            onChange={setSelectedCategory}
            style={{ width: 200 }}
            placeholder="Chọn danh mục"
          >
            <Option value="all">Tất cả danh mục</Option>
            {categories.map((category) => (
              <Option key={category.id} value={category.id}>
                {category.name}
              </Option>
            ))}
          </Select>
          <RangePicker
            value={dateRange}
            onChange={setDateRange}
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
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Lượt thích"
              value={stats.totalLikes}
              prefix={<HeartOutlined />}
              suffix={
                <Tooltip title="So với kỳ trước">
                  <span
                    className={
                      stats.likesChange >= 0 ? "text-green-500" : "text-red-500"
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
        <Col xs={24} sm={12} md={6}>
          <Card>
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
        <Col xs={24} sm={12} md={6}>
          <Card>
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
      </Row>

      <Card title="Top bài viết">
        <Table
          rowKey="id"
          columns={columns}
          dataSource={stats.topPosts}
          loading={loading}
          pagination={false}
        />
      </Card>
    </div>
  );
};

export default Analytics;
