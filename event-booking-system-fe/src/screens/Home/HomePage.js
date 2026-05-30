import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Container, Badge } from 'react-bootstrap';
import { useAuth } from '../../hooks/useAuth';
import { useEvents } from '../../hooks/event/useEvents';
import { useCategory } from '../../hooks/useCategory';
import { EmptyState, LoadingState } from '../../components';
import { eventFilters } from '../../filters/eventFilter';
import EventFilterPanel from '../Event/EventFilterPanel';
import EventCard from '../../components/event/EventCard';
import FeaturedEvent from '../../components/event/FeaturedEvent';
import { ROUTES } from '../../config/routes';
import './HomePage.css';

const COMPARE_STORAGE_KEY = 'compareList';
const MAX_COMPARE_EVENTS = 3;

const readCompareList = () => {
  try {
    return JSON.parse(localStorage.getItem(COMPARE_STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
};

const getStartOfDayTimestamp = (date) => {
  if (!date) return '';
  return new Date(`${date}T00:00:00`).getTime();
};

const getEndOfDayTimestamp = (date) => {
  if (!date) return '';
  return new Date(`${date}T23:59:59.999`).getTime();
};


const pickFeaturedEventByViews = (eventList) => {
  if (!eventList?.length) return null;

  let best = eventList[0];
  for (let i = 1; i < eventList.length; i++) {
    if ((Number(eventList[i].views) || 0) > (Number(best.views) || 0)) {
      best = eventList[i];
    }
  }
  return best;
};

const HomePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();

  const [searchTerm, setSearchTerm] = useState(() => searchParams.get('name') || '');
  const [selectedCategory, setSelectedCategory] = useState(() => searchParams.get('cateId') || '');
  const [location, setLocation] = useState(() => searchParams.get('location') || '');
  const [startDate, setStartDate] = useState(() => searchParams.get('startDate') || '');
  const [endDate, setEndDate] = useState(() => searchParams.get('endDate') || '');
  const [minPrice, setMinPrice] = useState(() => searchParams.get('fromPrice') || '');
  const [maxPrice, setMaxPrice] = useState(() => searchParams.get('toPrice') || '');
  const [sortDirection, setSortDirection] = useState(() => searchParams.get('sortDirection') || 'asc');
  const [page, setPage] = useState(() => {
    const pageParam = Number(searchParams.get('page'));
    return pageParam > 1 ? pageParam : 1;
  });
  const [showFilters, setShowFilters] = useState(false);

  const [compareList, setCompareList] = useState(readCompareList);

  useEffect(() => {
    if (compareList.length) {
      localStorage.setItem(COMPARE_STORAGE_KEY, JSON.stringify(compareList));
    } else {
      localStorage.removeItem(COMPARE_STORAGE_KEY);
    }
  }, [compareList]);

  const queryFilters = useMemo(
    () =>
      eventFilters.combine(
        eventFilters.byName(searchTerm),
        eventFilters.byCategory(selectedCategory),
        eventFilters.byLocation(location),
        eventFilters.byDateRange(
          getStartOfDayTimestamp(startDate),
          getEndOfDayTimestamp(endDate)
        ),
        eventFilters.byPriceRange(minPrice, maxPrice),
        eventFilters.bySort('startTime', sortDirection),
        eventFilters.byPage(page)
      ),
    [
      searchTerm,
      selectedCategory,
      location,
      startDate,
      endDate,
      minPrice,
      maxPrice,
      sortDirection,
      page,
    ]
  );

  const { events, loading, error, hasMore } = useEvents(queryFilters, {
    append: page > 1,
  });
  const { categories } = useCategory();

  const categoryIdByName = useMemo(() => {
    const map = new Map();
    categories.forEach((category) => {
      map.set(String(category.name).trim().toLowerCase(), Number(category.id));
    });
    return map;
  }, [categories]);

  const categoryOptions = useMemo(
    () => [
      { label: 'Tất cả', value: '' },
      ...categories.map((category) => ({
        label: category.name,
        value: category.id,
      })),
    ],
    [categories]
  );

  const hasActiveFilters = Boolean(
    searchTerm || selectedCategory || location || startDate || endDate || minPrice || maxPrice
  );

  const { featuredEvent, gridEvents } = useMemo(() => {
    if (hasActiveFilters || page !== 1 || events.length === 0) {
      return { featuredEvent: null, gridEvents: events };
    }

    const featured = pickFeaturedEventByViews(events);
    if (!featured) {
      return { featuredEvent: null, gridEvents: events };
    }

    return {
      featuredEvent: featured,
      gridEvents: events.filter((event) => event.id !== featured.id),
    };
  }, [events, hasActiveFilters, page]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (searchTerm) params.set('name', searchTerm);
    if (selectedCategory) params.set('cateId', selectedCategory);
    if (location) params.set('location', location);
    if (startDate) params.set('startDate', startDate);
    if (endDate) params.set('endDate', endDate);
    if (minPrice) params.set('fromPrice', minPrice);
    if (maxPrice) params.set('toPrice', maxPrice);
    if (sortDirection) params.set('sortDirection', sortDirection);
    if (page > 1) params.set('page', page);

    const search = params.toString();
    navigate({ pathname: '/', search: search ? `?${search}` : '' }, { replace: true });
  }, [
    searchTerm,
    selectedCategory,
    location,
    startDate,
    endDate,
    minPrice,
    maxPrice,
    sortDirection,
    page,
    navigate,
  ]);

  const handleViewDetails = (eventId) => navigate(`/event/${eventId}`);

  const handleLoadMore = () => setPage((current) => current + 1);

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setLocation('');
    setStartDate('');
    setEndDate('');
    setMinPrice('');
    setMaxPrice('');
    setSortDirection('asc');
    setPage(1);
  };

  const handleCategoryChip = (categoryId) => {
    setSelectedCategory(categoryId);
    setPage(1);
  };

  const getCategoryId = (event) =>
    categoryIdByName.get(String(event?.category || '').trim().toLowerCase()) ?? null;

  const handleToggleCompare = (event) => {
    const id = Number(event.id);
    if (!id) return;

    if (compareList.some((item) => item.id === id)) {
      setCompareList(compareList.filter((item) => item.id !== id));
      return;
    }

    const category_id = getCategoryId(event);
    if (!category_id) {
      window.alert('Không xác định được lĩnh vực của sự kiện này để so sánh.');
      return;
    }
    if (compareList.length >= MAX_COMPARE_EVENTS) {
      window.alert('Bạn chỉ có thể so sánh tối đa 3 sự kiện.');
      return;
    }
    if (compareList.length && compareList[0].category_id !== category_id) {
      window.alert('Chỉ cho phép so sánh các sự kiện thuộc cùng một lĩnh vực.');
      return;
    }

    setCompareList([
      ...compareList,
      { id, name: event.name || event.title || '', category_id },
    ]);
  };

  const handleGoToComparison = () => {
    if (compareList.length < 2) {
      window.alert('Vui lòng chọn từ 2 đến 3 sự kiện để tiến hành so sánh.');
      return;
    }
    navigate(ROUTES.EVENT_COMPARISON);
  };

  const activeFilterCount = [
    selectedCategory,
    location,
    startDate,
    endDate,
    minPrice,
    maxPrice,
  ].filter(Boolean).length;

  const scrollToCatalog = () => {
    document.getElementById('events-catalog')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="home-page page-shell">
      <section className="home-hero">
        <div className="home-hero__bg" aria-hidden="true" />
        <div className="home-hero__grain" aria-hidden="true" />
        <div className="home-hero__orb home-hero__orb--1" aria-hidden="true" />
        <div className="home-hero__orb home-hero__orb--2" aria-hidden="true" />

        <Container className="home-hero__inner">
          <div className="home-hero__copy">
            <p className="home-hero__eyebrow">Premium Event Experience</p>
            <h1 className="home-hero__title">
              Đặt vé sự kiện
            </h1>
            <p className="home-hero__lead">
              Khám phá những trải nghiệm được tuyển chọn - từ concert, gala đến hội thảo
              và triển lãm nghệ thuật. Tất cả ngay tại trang chủ.
            </p>

            {!user && (
              <div className="home-hero__auth">
                <button type="button" className="home-hero__btn home-hero__btn--gold" onClick={() => navigate('/register')}>
                  Bắt đầu hành trình
                </button>
                <button type="button" className="home-hero__btn home-hero__btn--ghost" onClick={() => navigate('/login')}>
                  Đăng nhập
                </button>
              </div>
            )}
          </div>

          <div className="home-hero__search-panel">
            <label className="home-hero__search-label" htmlFor="home-search">
              Tìm sự kiện
            </label>
            <div className="home-hero__search-row">
              <span className="home-hero__search-icon" aria-hidden="true">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <circle cx="11" cy="11" r="7" />
                  <path d="m20 20-3.5-3.5" />
                </svg>
              </span>
              <input
                id="home-search"
                type="search"
                className="home-hero__search-input"
                placeholder="Tên sự kiện, địa điểm..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPage(1);
                }}
                onKeyDown={(e) => e.key === 'Enter' && scrollToCatalog()}
              />
              <button type="button" className="home-hero__search-submit" onClick={scrollToCatalog}>
                Khám phá
              </button>
            </div>

            <div className="home-hero__quick-stats">
              <div>
                <strong>{events.length || '—'}</strong>
                <span>Sự kiện</span>
              </div>
              <div>
                <strong>{categories.length || '—'}</strong>
                <span>Lĩnh vực</span>
              </div>
              <div>
                <strong>24/7</strong>
                <span>Hỗ trợ</span>
              </div>
            </div>
          </div>
        </Container>

        <button type="button" className="home-hero__scroll-hint" onClick={scrollToCatalog} aria-label="Cuộn xuống danh sách sự kiện">
          <span />
        </button>
      </section>

      <main className="home-main" id="events-catalog">
        <Container>
          {loading && page === 1 ? (
            <div className="home-loading">
              <LoadingState text="Đang tải sự kiện..." />
            </div>
          ) : error ? (
            <EmptyState description={`Lỗi: ${error}`} className="home-empty text-center py-5" />
          ) : (
            <>
              {featuredEvent && (
                <FeaturedEvent
                  event={featuredEvent}
                  categoryName={featuredEvent.category || ''}
                  onViewDetails={handleViewDetails}
                />
              )}

              <header className="home-catalog__header">
                <div>
                  <p className="home-catalog__eyebrow">Bộ sưu tập</p>
                  <h2 className="home-catalog__title">Sự kiện đang mở bán</h2>
                </div>
                <p className="home-catalog__count">
                  {events.length > 0
                    ? `${events.length}${hasMore ? '+' : ''} trải nghiệm`
                    : 'Chưa có sự kiện'}
                </p>
              </header>

              <div className="home-toolbar">
                <button
                  type="button"
                  className={`home-toolbar__filter${showFilters ? ' is-active' : ''}`}
                  onClick={() => setShowFilters((v) => !v)}
                  aria-expanded={showFilters}
                >
                  Bộ lọc nâng cao
                  {activeFilterCount > 0 && <Badge className="home-toolbar__badge">{activeFilterCount}</Badge>}
                </button>
                {hasActiveFilters && (
                  <button type="button" className="home-toolbar__clear" onClick={handleResetFilters}>
                    Xóa lọc
                  </button>
                )}
                {compareList.length > 0 && (
                  <>
                    <button
                      type="button"
                      className="home-toolbar__compare"
                      onClick={handleGoToComparison}
                      disabled={compareList.length < 2}
                    >
                      So sánh ({compareList.length}/3)
                    </button>
                    <button
                      type="button"
                      className="home-toolbar__clear"
                      onClick={() => setCompareList([])}
                    >
                      Bỏ chọn tất cả so sánh
                    </button>
                  </>
                )}
              </div>

              {categories.length > 0 && (
                <div className="home-chips" role="tablist" aria-label="Lọc theo lĩnh vực">
                  {categoryOptions.map((option) => (
                    <button
                      key={option.value || 'all'}
                      type="button"
                      role="tab"
                      aria-selected={selectedCategory === option.value}
                      className={`home-chip${selectedCategory === option.value ? ' is-active' : ''}`}
                      onClick={() => handleCategoryChip(option.value)}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}

              {showFilters && (
                <div className="home-filters">
                  <EventFilterPanel
                    id="event-filters"
                    selectedCategory={selectedCategory}
                    location={location}
                    startDate={startDate}
                    endDate={endDate}
                    minPrice={minPrice}
                    maxPrice={maxPrice}
                    sortDirection={sortDirection}
                    categoryOptions={categoryOptions.map((o) =>
                      o.value === '' ? { ...o, label: 'Tất cả lĩnh vực' } : o
                    )}
                    onCategoryChange={(e) => {
                      setSelectedCategory(e.target.value);
                      setPage(1);
                    }}
                    onLocationChange={(e) => {
                      setLocation(e.target.value);
                      setPage(1);
                    }}
                    onStartDateChange={(e) => {
                      setStartDate(e.target.value);
                      setPage(1);
                    }}
                    onEndDateChange={(e) => {
                      setEndDate(e.target.value);
                      setPage(1);
                    }}
                    onMinPriceChange={(e) => {
                      setMinPrice(e.target.value);
                      setPage(1);
                    }}
                    onMaxPriceChange={(e) => {
                      setMaxPrice(e.target.value);
                      setPage(1);
                    }}
                    onSortDirectionChange={(e) => {
                      setSortDirection(e.target.value);
                      setPage(1);
                    }}
                    onResetFilters={handleResetFilters}
                  />
                </div>
              )}

              {gridEvents.length > 0 ? (
                <div className="home-grid">
                  {gridEvents.map((event, index) => (
                    <EventCard
                      key={event.id}
                      event={event}
                      categoryName={event.category || ''}
                      onViewDetails={handleViewDetails}
                      index={index}
                      onToggleCompare={handleToggleCompare}
                      isCompared={compareList.some((item) => item.id === event.id)}
                    />
                  ))}
                </div>
              ) : !featuredEvent ? (
                <EmptyState description="Không tìm thấy sự kiện phù hợp" className="home-empty text-center py-5" />
              ) : null}

              {events.length > 0 && hasMore && (
                <div className="home-load-more">
                  <button
                    type="button"
                    className="home-load-more__btn"
                    onClick={handleLoadMore}
                    disabled={loading}
                  >
                    {loading ? 'Đang tải...' : 'Xem thêm sự kiện'}
                  </button>
                </div>
              )}
            </>
          )}
        </Container>
      </main>
    </div>
  );
};

export default HomePage;
