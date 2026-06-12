import { useMemo, useState } from 'react'
import peopleData from '../../../../content/people/proletarian_biographical_index.json'
import { PageHeader } from '../components/PageHeader'

type PersonSource = {
  work: string
  volume: string
  page: string
  context: string
}

type PersonRelation = {
  type: string
  target: string
  note: string
}

type Person = {
  id: number
  name: string
  cn_name: string
  aliases: string[]
  years: string
  country: string
  identity: string
  major_works: string[]
  historical_role: string
  summary: string
  stance_summary: string
  index_summary: string
  index_summary_source: string
  index_summary_needs_review: boolean
  ai_draft_summary: string
  ai_draft_stance_summary: string
  author_stance_summary: string
  author_review_status: 'todo' | 'index_checked' | 'stance_written' | 'published'
  schools: string[]
  period: string
  sources: PersonSource[]
  relations: PersonRelation[]
  related_people: string[]
  tags: string[]
  needs_review: boolean
}

const people = peopleData as Person[]

function uniqueSorted(values: string[]) {
  return Array.from(new Set(values.filter(Boolean))).sort((a, b) => a.localeCompare(b, 'zh-Hans-CN'))
}

function includesText(value: string, query: string) {
  return value.toLocaleLowerCase().includes(query.toLocaleLowerCase())
}

function buildMatrix(items: Person[]) {
  return items.reduce<Record<string, Record<string, Person[]>>>((matrix, person) => {
    matrix[person.period] = matrix[person.period] ?? {}

    person.schools.forEach((school) => {
      matrix[person.period][school] = matrix[person.period][school] ?? []
      matrix[person.period][school].push(person)
    })

    return matrix
  }, {})
}

export function PeoplePage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [periodFilter, setPeriodFilter] = useState('')
  const [schoolFilter, setSchoolFilter] = useState('')
  const [countryFilter, setCountryFilter] = useState('')
  const [identityTagFilter, setIdentityTagFilter] = useState('')
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null)

  const periods = useMemo(() => uniqueSorted(people.map((person) => person.period)), [])
  const schools = useMemo(() => uniqueSorted(people.flatMap((person) => person.schools)), [])
  const countries = useMemo(() => uniqueSorted(people.map((person) => person.country)), [])
  const identitiesAndTags = useMemo(
    () => uniqueSorted(people.flatMap((person) => [person.identity, ...person.tags])),
    []
  )

  const filteredPeople = useMemo(() => {
    const query = searchQuery.trim()

    return people.filter((person) => {
      const matchesSearch =
        !query ||
        [
          person.cn_name,
          person.name,
          person.identity,
          person.historical_role,
          person.summary,
          person.index_summary,
          person.index_summary_source,
          person.author_stance_summary,
          ...person.aliases,
          ...person.major_works,
          ...person.related_people,
          ...person.tags,
          ...person.schools
        ].some((value) => includesText(value, query))

      const matchesPeriod = !periodFilter || person.period === periodFilter
      const matchesSchool = !schoolFilter || person.schools.includes(schoolFilter)
      const matchesCountry = !countryFilter || person.country === countryFilter
      const matchesIdentityTag =
        !identityTagFilter || person.identity === identityTagFilter || person.tags.includes(identityTagFilter)

      return matchesSearch && matchesPeriod && matchesSchool && matchesCountry && matchesIdentityTag
    })
  }, [countryFilter, identityTagFilter, periodFilter, schoolFilter, searchQuery])

  const matrix = useMemo(() => buildMatrix(filteredPeople), [filteredPeople])
  const hasActiveFilters = Boolean(
    searchQuery || periodFilter || schoolFilter || countryFilter || identityTagFilter
  )

  function resetFilters() {
    setSearchQuery('')
    setPeriodFilter('')
    setSchoolFilter('')
    setCountryFilter('')
    setIdentityTagFilter('')
  }

  return (
    <section className="people-page">
      <PageHeader
        eyebrow="Appendix"
        title="无产阶级人物索引库"
        description="这个索引用于帮助读者理解经典著作、政治经济学批判、革命史和未来知识游戏平台中的人物。它不是中立百科，而是从无产阶级立场整理人物的历史位置、文本语境和阶级局限。"
      />

      <section className="people-tools" aria-label="人物检索与筛选">
        <label className="people-search" htmlFor="people-search">
          <span>搜索人物</span>
          <input
            id="people-search"
            type="search"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="输入中文名、英文名或别名..."
          />
        </label>

        <div className="people-filter-grid">
          <label>
            <span>历史时期</span>
            <select value={periodFilter} onChange={(event) => setPeriodFilter(event.target.value)}>
              <option value="">全部时期</option>
              {periods.map((period) => (
                <option value={period} key={period}>
                  {period}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span>学派 / 理论脉络</span>
            <select value={schoolFilter} onChange={(event) => setSchoolFilter(event.target.value)}>
              <option value="">全部学派</option>
              {schools.map((school) => (
                <option value={school} key={school}>
                  {school}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span>国家 / 地区</span>
            <select value={countryFilter} onChange={(event) => setCountryFilter(event.target.value)}>
              <option value="">全部国家 / 地区</option>
              {countries.map((country) => (
                <option value={country} key={country}>
                  {country}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span>身份 / 标签</span>
            <select value={identityTagFilter} onChange={(event) => setIdentityTagFilter(event.target.value)}>
              <option value="">全部身份 / 标签</option>
              {identitiesAndTags.map((item) => (
                <option value={item} key={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="people-result-bar">
          <p>当前显示 {filteredPeople.length} 人</p>
          {hasActiveFilters ? (
            <button type="button" onClick={resetFilters}>
              重置筛选
            </button>
          ) : null}
        </div>
      </section>

      <section className="people-card-grid" aria-label="人物卡片">
        {filteredPeople.map((person) => (
          <article className="person-card" key={person.id}>
            <div>
              <div className="person-card-topline">
                <p className="person-period">{person.period}</p>
                <span className={person.needs_review ? 'review-badge pending' : 'review-badge done'}>
                  {person.needs_review ? '待审核' : '已初审'}
                </span>
              </div>
              <h2>
                {person.cn_name}
                <span>{person.name}</span>
              </h2>
              <dl className="person-facts">
                <div>
                  <dt>年代</dt>
                  <dd>{person.years}</dd>
                </div>
                <div>
                  <dt>国家</dt>
                  <dd>{person.country}</dd>
                </div>
              </dl>
              <p className="person-identity">{person.identity}</p>
              <p className="person-role">{person.historical_role}</p>
              <p>{person.summary}</p>
            </div>

            <div className="people-tags" aria-label={`${person.cn_name} 标签`}>
              {person.tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>

            <button className="card-action open" type="button" onClick={() => setSelectedPerson(person)}>
              查看详情
            </button>
          </article>
        ))}
      </section>

      {filteredPeople.length === 0 ? (
        <section className="markdown-state markdown-not-found">
          <h1>没有找到匹配人物</h1>
          <p>可以减少关键词或筛选条件后再试。</p>
        </section>
      ) : null}

      <section className="people-matrix">
        <div className="knowledge-group-header">
          <p className="eyebrow">Matrix View</p>
          <h2>按历史时期与学派分组</h2>
        </div>
        {Object.entries(matrix).map(([period, schoolGroups]) => (
          <article className="people-matrix-period" key={period}>
            <h3>{period}</h3>
            <div className="people-matrix-schools">
              {Object.entries(schoolGroups).map(([school, schoolPeople]) => (
                <div className="people-matrix-school" key={`${period}-${school}`}>
                  <h4>{school}</h4>
                  <ul>
                    {schoolPeople.map((person) => (
                      <li key={`${period}-${school}-${person.id}`}>
                        {person.cn_name} <span>{person.name}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </article>
        ))}
      </section>

      {selectedPerson ? (
        <div className="people-modal-backdrop" role="presentation" onClick={() => setSelectedPerson(null)}>
          <section
            className="people-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="people-modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="people-modal-header">
              <div>
                <p className="eyebrow">人物详情</p>
                <h2 id="people-modal-title">
                  {selectedPerson.cn_name}
                  <span>{selectedPerson.name}</span>
                </h2>
                <span className={selectedPerson.needs_review ? 'review-badge pending' : 'review-badge done'}>
                  {selectedPerson.needs_review ? '待审核' : '已初审'}
                </span>
              </div>
              <button type="button" onClick={() => setSelectedPerson(null)} aria-label="关闭人物详情">
                关闭
              </button>
            </div>

            <div className="people-detail-grid">
              <section>
                <h3>事实信息</h3>
                <dl className="people-detail-list">
                  <div>
                    <dt>别名</dt>
                    <dd>{selectedPerson.aliases.join('、')}</dd>
                  </div>
                  <div>
                    <dt>年代</dt>
                    <dd>{selectedPerson.years}</dd>
                  </div>
                  <div>
                    <dt>国家 / 地区</dt>
                    <dd>{selectedPerson.country}</dd>
                  </div>
                  <div>
                    <dt>身份</dt>
                    <dd>{selectedPerson.identity}</dd>
                  </div>
                  <div>
                    <dt>历史作用</dt>
                    <dd>{selectedPerson.historical_role}</dd>
                  </div>
                  <div>
                    <dt>代表作品</dt>
                    <dd>{selectedPerson.major_works.length ? selectedPerson.major_works.join('、') : '待补'}</dd>
                  </div>
                  <div>
                    <dt>历史时期</dt>
                    <dd>{selectedPerson.period}</dd>
                  </div>
                  <div>
                    <dt>学派 / 理论脉络</dt>
                    <dd>{selectedPerson.schools.join('、')}</dd>
                  </div>
                </dl>
              </section>

              <section>
                <h3>索引简介</h3>
                <p>{selectedPerson.index_summary || selectedPerson.summary || '索引简介待补'}</p>
                {selectedPerson.index_summary_source ? (
                  <p className="people-detail-note">
                    来源：{selectedPerson.index_summary_source}
                    {selectedPerson.index_summary_needs_review ? '（待复核）' : ''}
                  </p>
                ) : (
                  <p className="people-detail-note">索引来源待补。</p>
                )}
              </section>

              <section>
                <h3>作者立场评价</h3>
                <p>{selectedPerson.author_stance_summary || '作者立场评价待补。'}</p>
              </section>

              <section>
                <h3>文本 / 文献语境</h3>
                <div className="people-detail-stack">
                  {selectedPerson.sources.map((source) => (
                    <article key={`${source.work}-${source.context}`}>
                      <strong>{source.work}</strong>
                      {source.volume || source.page ? (
                        <span>
                          {source.volume}
                          {source.page ? ` ${source.page}` : ''}
                        </span>
                      ) : null}
                      <p>{source.context}</p>
                    </article>
                  ))}
                </div>
              </section>

              <section>
                <h3>关系</h3>
                <div className="people-detail-stack">
                  {selectedPerson.relations.map((relation) => (
                    <article key={`${relation.type}-${relation.target}`}>
                      <strong>
                        {relation.type}: {relation.target}
                      </strong>
                      <p>{relation.note}</p>
                    </article>
                  ))}
                </div>
              </section>

              <section>
                <h3>相关人物</h3>
                {selectedPerson.related_people.length ? (
                  <div className="people-tags">
                    {selectedPerson.related_people.map((personName) => (
                      <span key={personName}>{personName}</span>
                    ))}
                  </div>
                ) : (
                  <p>待补</p>
                )}
              </section>

              <section>
                <h3>标签</h3>
                <div className="people-tags">
                  {selectedPerson.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
              </section>

              <section className="people-ai-draft">
                <details>
                  <summary>AI 草稿，仅供参考</summary>
                  <div className="people-detail-stack">
                    <article>
                      <strong>AI 摘要草稿</strong>
                      <p>{selectedPerson.ai_draft_summary || '无'}</p>
                    </article>
                    <article>
                      <strong>AI 立场草稿</strong>
                      <p>{selectedPerson.ai_draft_stance_summary || '无'}</p>
                    </article>
                  </div>
                </details>
              </section>
            </div>
          </section>
        </div>
      ) : null}
    </section>
  )
}
