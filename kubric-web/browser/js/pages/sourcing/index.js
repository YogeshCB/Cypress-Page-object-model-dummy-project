import { h } from "preact";
import styles from "stylesheets/sourcing/index";
import ImageGrid from "../../components/commons/ImageGrid";
import { PrimaryButton } from "../../components/commons/misc";
import { exportCSVFile } from "./utils";
import CompoundRange from "../../components/commons/CompoundRange";

const BATCH_SIZE = 200;
const RANK_KEY = "new_rank_2";

const filterByNormalizedRank = (data = [], range = { min: 0, max: 1 }) => {
	const rangeValue = data.map(o => o[RANK_KEY]);
	const minVal = Math.min(...rangeValue);
	const maxVal = Math.max(...rangeValue);
	return data
		.map(o => ({ ...o, normalRank: (o[RANK_KEY] - minVal) / (maxVal - minVal) }))
		.filter(o => o.normalRank >= range.min && o.normalRank <= range.max);
};

export default ({
	imageBank,
	selectedIds,
	onRowSelected,
	onRowUnselected,
	onClearRowSelections,
	selectedImages,
	page,
	range,
	nextPage,
	previousPage,
	selectPage,
	updateRange
}) => {
	const assets = imageBank && imageBank.results ? filterByNormalizedRank(imageBank.results, range) : [];
	const selectionNotEmpty = selectedIds && selectedIds.length > 0;
	const totalPages = assets.length / BATCH_SIZE;

	const exportSelectedImages = () => {
		const headers = {};
		const formattedItems = [];

		Object.keys(selectedImages[0]).map(key => (headers[key] = key));
		selectedImages.map(image => {
			const formattedObject = {};
			Object.keys(headers).map(key => {
				formattedObject[key] = typeof image[key] === "string" ? image[key].replace(/,/g, "") : image[key];
			});
			formattedItems.push(formattedObject);
		});

		exportCSVFile(headers, formattedItems, "exported");
	};

	return (
		<div className={styles.pageContainer}>
			<div className={styles.topSection}>
				<div className={styles.left}>
					<div className={`${styles.label} ${styles.bold}`}> Score</div>
					<div className={styles.rangeContainer}>
						<CompoundRange
							val1={range.min}
							val2={range.max}
							min={0}
							max={1}
							step={0.1}
							onChange={({ val1, val2 }) => {
								updateRange({ min: val1, max: val2 });
							}}
						/>
					</div>
					<div className={`${styles.rangeLabel}`}> Min</div>
					<input
						className={styles.range}
						min={0}
						max={range.max}
						value={range.min}
						step={0.1}
						type={"number"}
						onInput={e => {
							updateRange({ min: e.target.value, max: range.max });
						}}
						label={"Min"}
					/>
					<div className={`${styles.rangeLabel}`}> Max</div>
					<input
						className={styles.range}
						step={0.1}
						min={range.min}
						max={1}
						value={range.max}
						type={"number"}
						onInput={e => {
							updateRange({ min: range.min, max: e.target.value });
						}}
						label={"Max"}
					/>
				</div>
				<div className={styles.right}>
					<div className={styles.label}>{`${assets.length} Images`}</div>
					{selectionNotEmpty && <div className={styles.label}>{`${selectedIds.length} Selected`}</div>}
					{selectionNotEmpty && (
						<div onClick={onClearRowSelections} className={`${styles.label} ${styles.bold} ${styles.link}`}>
							Unselect All
						</div>
					)}
					<PrimaryButton isDisabled={!selectionNotEmpty} onClick={exportSelectedImages.bind(this)}>
						Export Selection to CSV
					</PrimaryButton>
				</div>
			</div>
			<ImageGrid
				data={assets}
				from={page * BATCH_SIZE}
				to={page * BATCH_SIZE + BATCH_SIZE}
				selectedIds={selectedIds}
				onSelect={onRowSelected}
				onUnselect={onRowUnselected}
			/>
			{totalPages > 0 && (
				<div className={styles.bottomSection}>
					{Array.from({ length: totalPages }).map((x, i) => {
						return (
							<div className={`${page === i ? styles.activePage : styles.page}`} onClick={selectPage.bind(this, i)}>
								{i + 1}
							</div>
						);
					})}
				</div>
			)}
		</div>
	);
};
